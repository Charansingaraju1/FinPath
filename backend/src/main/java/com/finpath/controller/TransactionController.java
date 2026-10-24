package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.CreateTransactionRequest;
import com.finpath.dto.TransactionDto;
import com.finpath.entity.User;
import com.finpath.service.AuthService;
import com.finpath.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final AuthService authService;

    public TransactionController(TransactionService transactionService, AuthService authService) {
        this.transactionService = transactionService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionDto>>> getTransactions(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(transactionService.getUserTransactions(user.getId())));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.ok(transactionService.getFinancialSummary(user.getId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionDto>> createTransaction(
            @Valid @RequestBody CreateTransactionRequest request,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        TransactionDto dto = transactionService.createTransaction(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Transaction recorded successfully", dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionDto>> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody CreateTransactionRequest request,
            Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        TransactionDto dto = transactionService.updateTransaction(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Transaction updated successfully", dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        transactionService.deleteTransaction(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Transaction deleted successfully", null));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        String csv = transactionService.exportTransactionsCsv(user.getId());
        byte[] bytes = csv.getBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"finpath_transactions.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }
}
