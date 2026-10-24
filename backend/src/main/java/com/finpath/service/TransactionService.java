package com.finpath.service;

import com.finpath.dto.CreateTransactionRequest;
import com.finpath.dto.TransactionDto;
import com.finpath.entity.FinancialGoal;
import com.finpath.entity.Transaction;
import com.finpath.entity.User;
import com.finpath.exception.ResourceNotFoundException;
import com.finpath.repository.FinancialGoalRepository;
import com.finpath.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final FinancialGoalRepository goalRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              FinancialGoalRepository goalRepository) {
        this.transactionRepository = transactionRepository;
        this.goalRepository = goalRepository;
    }

    public List<TransactionDto> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionDto createTransaction(User user, CreateTransactionRequest request) {
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setType(request.getType());
        tx.setCategory(request.getCategory());
        tx.setAmount(request.getAmount());
        tx.setDescription(request.getDescription());
        tx.setTransactionDate(request.getTransactionDate() != null ? request.getTransactionDate() : LocalDate.now());

        if (request.getGoalId() != null) {
            FinancialGoal goal = goalRepository.findByIdAndUserId(request.getGoalId(), user.getId()).orElse(null);
            tx.setGoal(goal);

            // If it's a goal allocation or savings contribution, increment the goal's current allocated amount
            if (goal != null && ("GOAL_ALLOCATION".equals(request.getType()) || "SAVINGS_CONTRIBUTION".equals(request.getType()))) {
                BigDecimal current = goal.getCurrentAllocated() != null ? goal.getCurrentAllocated() : BigDecimal.ZERO;
                goal.setCurrentAllocated(current.add(request.getAmount()));
                goalRepository.save(goal);
            }
        }

        tx = transactionRepository.save(tx);
        return mapToDto(tx);
    }

    @Transactional
    public TransactionDto updateTransaction(Long id, Long userId, CreateTransactionRequest request) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // Adjust goal allocation if modified
        if (tx.getGoal() != null && ("GOAL_ALLOCATION".equals(tx.getType()) || "SAVINGS_CONTRIBUTION".equals(tx.getType()))) {
            FinancialGoal goal = tx.getGoal();
            BigDecimal difference = request.getAmount().subtract(tx.getAmount());
            BigDecimal current = goal.getCurrentAllocated() != null ? goal.getCurrentAllocated() : BigDecimal.ZERO;
            goal.setCurrentAllocated(current.add(difference).max(BigDecimal.ZERO));
            goalRepository.save(goal);
        }

        tx.setType(request.getType());
        tx.setCategory(request.getCategory());
        tx.setAmount(request.getAmount());
        tx.setDescription(request.getDescription());
        if (request.getTransactionDate() != null) {
            tx.setTransactionDate(request.getTransactionDate());
        }

        tx = transactionRepository.save(tx);
        return mapToDto(tx);
    }

    @Transactional
    public void deleteTransaction(Long id, Long userId) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (tx.getGoal() != null && ("GOAL_ALLOCATION".equals(tx.getType()) || "SAVINGS_CONTRIBUTION".equals(tx.getType()))) {
            FinancialGoal goal = tx.getGoal();
            BigDecimal current = goal.getCurrentAllocated() != null ? goal.getCurrentAllocated() : BigDecimal.ZERO;
            goal.setCurrentAllocated(current.subtract(tx.getAmount()).max(BigDecimal.ZERO));
            goalRepository.save(goal);
        }

        transactionRepository.delete(tx);
    }

    public Map<String, Object> getFinancialSummary(Long userId) {
        List<Transaction> all = transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(userId);

        BigDecimal personalIncome = BigDecimal.ZERO;
        BigDecimal personalExpense = BigDecimal.ZERO;
        BigDecimal businessIncome = BigDecimal.ZERO;
        BigDecimal businessExpense = BigDecimal.ZERO;
        BigDecimal savingsAllocated = BigDecimal.ZERO;

        for (Transaction t : all) {
            switch (t.getType()) {
                case "PERSONAL_INCOME" -> personalIncome = personalIncome.add(t.getAmount());
                case "PERSONAL_EXPENSE" -> personalExpense = personalExpense.add(t.getAmount());
                case "BUSINESS_INCOME" -> businessIncome = businessIncome.add(t.getAmount());
                case "BUSINESS_EXPENSE" -> businessExpense = businessExpense.add(t.getAmount());
                case "GOAL_ALLOCATION", "SAVINGS_CONTRIBUTION" -> savingsAllocated = savingsAllocated.add(t.getAmount());
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("personalIncome", personalIncome);
        summary.put("personalExpense", personalExpense);
        summary.put("businessIncome", businessIncome);
        summary.put("businessExpense", businessExpense);
        summary.put("businessNetProfit", businessIncome.subtract(businessExpense));
        summary.put("savingsAllocated", savingsAllocated);
        summary.put("totalTransactionsCount", all.size());
        return summary;
    }

    public String exportTransactionsCsv(Long userId) {
        List<Transaction> list = transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(userId);
        StringWriter sw = new StringWriter();
        sw.append("ID,Date,Type,Category,Amount (INR),Description,Goal\n");
        for (Transaction t : list) {
            sw.append(String.valueOf(t.getId())).append(",");
            sw.append(t.getTransactionDate().toString()).append(",");
            sw.append("\"").append(t.getType()).append("\",");
            sw.append("\"").append(t.getCategory().replace("\"", "\"\"")).append("\",");
            sw.append(t.getAmount().toPlainString()).append(",");
            sw.append("\"").append(t.getDescription() != null ? t.getDescription().replace("\"", "\"\"") : "").append("\",");
            sw.append("\"").append(t.getGoal() != null ? t.getGoal().getTitle().replace("\"", "\"\"") : "").append("\"\n");
        }
        return sw.toString();
    }

    public TransactionDto mapToDto(Transaction t) {
        TransactionDto dto = new TransactionDto();
        dto.setId(t.getId());
        dto.setType(t.getType());
        dto.setCategory(t.getCategory());
        dto.setAmount(t.getAmount());
        dto.setDescription(t.getDescription());
        dto.setTransactionDate(t.getTransactionDate());
        if (t.getGoal() != null) {
            dto.setGoalId(t.getGoal().getId());
            dto.setGoalTitle(t.getGoal().getTitle());
        }
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}
