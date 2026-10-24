package com.finpath.controller;

import com.finpath.dto.ApiResponse;
import com.finpath.dto.RevenueCalculatorRequest;
import com.finpath.dto.ScenarioComparisonResult;
import com.finpath.service.RevenueCalculationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/revenue-calculator")
public class RevenueCalculatorController {

    private final RevenueCalculationService revenueCalculationService;

    public RevenueCalculatorController(RevenueCalculationService revenueCalculationService) {
        this.revenueCalculationService = revenueCalculationService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<ScenarioComparisonResult>> calculateScenarios(
            @Valid @RequestBody RevenueCalculatorRequest request) {
        ScenarioComparisonResult result = revenueCalculationService.compareScenarios(request);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
