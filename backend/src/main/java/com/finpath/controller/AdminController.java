package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.entity.Opportunity;
import com.finpath.entity.OpportunityCategory;
import com.finpath.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAggregateMetrics()));
    }

    @GetMapping("/opportunities")
    public ResponseEntity<ApiResponse<List<Opportunity>>> getAllOpportunities() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllOpportunitiesForAdmin()));
    }

    @PatchMapping("/opportunities/{id}/approval")
    public ResponseEntity<ApiResponse<Opportunity>> toggleApproval(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Approval status updated", adminService.toggleOpportunityApproval(id)));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<OpportunityCategory>> createCategory(
            @RequestParam String name,
            @RequestParam String slug,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String icon) {
        return ResponseEntity.ok(ApiResponse.ok("Category created", adminService.createCategory(name, slug, description, icon)));
    }
}
