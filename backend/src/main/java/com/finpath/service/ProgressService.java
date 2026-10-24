package com.finpath.service;

import com.finpath.dto.ProgressReportDto;
import com.finpath.dto.RoadmapDto;
import com.finpath.dto.RoadmapTaskDto;
import com.finpath.entity.*;
import com.finpath.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final FinancialGoalRepository goalRepository;
    private final FinancialProfileRepository financialProfileRepository;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapTaskRepository taskRepository;
    private final OpportunityValidationRepository validationRepository;
    private final TransactionRepository transactionRepository;
    private final RoadmapService roadmapService;
    private final FinancialCalculationService financialCalculationService;

    public ProgressService(FinancialGoalRepository goalRepository,
                           FinancialProfileRepository financialProfileRepository,
                           RoadmapRepository roadmapRepository,
                           RoadmapTaskRepository taskRepository,
                           OpportunityValidationRepository validationRepository,
                           TransactionRepository transactionRepository,
                           RoadmapService roadmapService,
                           FinancialCalculationService financialCalculationService) {
        this.goalRepository = goalRepository;
        this.financialProfileRepository = financialProfileRepository;
        this.roadmapRepository = roadmapRepository;
        this.taskRepository = taskRepository;
        this.validationRepository = validationRepository;
        this.transactionRepository = transactionRepository;
        this.roadmapService = roadmapService;
        this.financialCalculationService = financialCalculationService;
    }

    public ProgressReportDto getProgressReport(Long userId) {
        ProgressReportDto report = new ProgressReportDto();
        List<String> recommendations = new ArrayList<>();

        // 1. Goal Progress
        FinancialGoal goal = goalRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, "ACTIVE")
                .orElse(null);
        if (goal != null) {
            report.setTargetGoalAmount(goal.getTargetAmount());
            report.setCurrentGoalAllocated(goal.getCurrentAllocated());
            if (goal.getTargetAmount() != null && goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal pct = goal.getCurrentAllocated().multiply(BigDecimal.valueOf(100))
                        .divide(goal.getTargetAmount(), 1, RoundingMode.HALF_UP);
                report.setGoalCompletionPercentage(pct.min(BigDecimal.valueOf(100)));
            } else {
                report.setGoalCompletionPercentage(BigDecimal.ZERO);
            }
        } else {
            report.setTargetGoalAmount(BigDecimal.ZERO);
            report.setCurrentGoalAllocated(BigDecimal.ZERO);
            report.setGoalCompletionPercentage(BigDecimal.ZERO);
        }

        // 2. Savings & Financials from Profile & Transactions
        FinancialProfile profile = financialProfileRepository.findByUserId(userId).orElse(null);
        BigDecimal currentSavings = profile != null && profile.getCurrentSavings() != null
                ? profile.getCurrentSavings() : BigDecimal.ZERO;
        report.setActualSavings(currentSavings);

        // Calculate transaction actuals
        List<Transaction> txs = transactionRepository.findByUserIdOrderByTransactionDateDescCreatedAtDesc(userId);
        BigDecimal actualRevenue = BigDecimal.ZERO;
        BigDecimal actualCosts = BigDecimal.ZERO;
        BigDecimal savingsContributions = BigDecimal.ZERO;
        int payingCustomers = 0;

        for (Transaction t : txs) {
            if ("BUSINESS_INCOME".equals(t.getType())) {
                actualRevenue = actualRevenue.add(t.getAmount());
                payingCustomers++;
            } else if ("BUSINESS_EXPENSE".equals(t.getType())) {
                actualCosts = actualCosts.add(t.getAmount());
            } else if ("SAVINGS_CONTRIBUTION".equals(t.getType()) || "GOAL_ALLOCATION".equals(t.getType())) {
                savingsContributions = savingsContributions.add(t.getAmount());
            }
        }

        report.setActualBusinessRevenue(actualRevenue);
        report.setActualBusinessCosts(actualCosts);
        report.setActualNetBusinessProfit(actualRevenue.subtract(actualCosts));
        report.setActualPayingCustomersCount(payingCustomers);

        // Planned savings based on monthly surplus
        BigDecimal monthlySurplus = financialCalculationService.calculateMonthlySurplus(profile);
        BigDecimal plannedSavings = monthlySurplus.max(BigDecimal.ZERO).multiply(BigDecimal.valueOf(3)); // 3-month baseline
        report.setPlannedSavings(plannedSavings);
        report.setSavingsVariance(currentSavings.subtract(plannedSavings));

        // 3. Roadmap Tasks
        List<RoadmapTask> allTasks = taskRepository.findByRoadmapUserIdAndIsCompletedFalseOrderByDueDateAsc(userId);
        Roadmap activeRoadmap = roadmapRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, "ACTIVE")
                .orElse(null);

        if (activeRoadmap != null) {
            List<RoadmapTask> roadmapTasks = activeRoadmap.getTasks();
            report.setTotalRoadmapTasks(roadmapTasks.size());
            int done = (int) roadmapTasks.stream().filter(RoadmapTask::getIsCompleted).count();
            report.setCompletedRoadmapTasks(done);
            report.setTaskCompletionPercentage(roadmapTasks.isEmpty() ? BigDecimal.ZERO :
                    BigDecimal.valueOf(done * 100.0 / roadmapTasks.size()).setScale(1, RoundingMode.HALF_UP));

            List<RoadmapTaskDto> upcoming = roadmapTasks.stream()
                    .filter(t -> !t.getIsCompleted())
                    .limit(4)
                    .map(roadmapService::mapTaskToDto)
                    .collect(Collectors.toList());
            report.setUpcomingMilestones(upcoming);
        } else {
            report.setTotalRoadmapTasks(0);
            report.setCompletedRoadmapTasks(0);
            report.setTaskCompletionPercentage(BigDecimal.ZERO);
            report.setUpcomingMilestones(new ArrayList<>());
        }

        // 4. Validation metrics
        List<OpportunityValidation> validations = validationRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        int totalInterviews = 0;
        int validatedCount = 0;
        for (OpportunityValidation v : validations) {
            totalInterviews += v.getPeopleInterviewedCount();
            if ("READY_TO_BUILD".equals(v.getStage()) || "WILLINGNESS_TO_PAY_TESTED".equals(v.getStage())) {
                validatedCount++;
            }
        }
        report.setCustomerInterviewsCompleted(totalInterviews);
        report.setOpportunitiesValidatedCount(validatedCount);

        // 5. Daily actions
        report.setTodayActions(roadmapService.getDailyActions(userId));

        // 6. Pacing & Strategic Recommendations
        if (report.getGoalCompletionPercentage().compareTo(BigDecimal.valueOf(80)) >= 0) {
            report.setPacingStatus("AHEAD");
            recommendations.add("You are within reach of your goal! Ensure savings are secured in a low-risk account.");
        } else if (report.getTaskCompletionPercentage().compareTo(BigDecimal.valueOf(40)) >= 0) {
            report.setPacingStatus("ON_TRACK");
            recommendations.add("Keep momentum on your weekly tasks. Complete scheduled interviews to deepen evidence.");
        } else if (report.getTaskCompletionPercentage().compareTo(BigDecimal.valueOf(15)) >= 0) {
            report.setPacingStatus("SLIGHTLY_BEHIND");
            recommendations.add("Consider dedicating 2 extra hours this weekend to catch up on pending validation tasks.");
            recommendations.add("Review discretionary expenses this month to buffer savings against timeline slips.");
        } else {
            report.setPacingStatus("OFF_TRACK");
            recommendations.add("Your task progress is currently behind plan. Start by tackling the single highest priority milestone today.");
            recommendations.add("If your available time has decreased, consider adjusting your roadmap duration to 12 months.");
            recommendations.add("Explore alternative micro-services that require lower initial setup time.");
        }

        report.setStrategicRecommendations(recommendations);
        return report;
    }
}
