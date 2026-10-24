package com.finpath.service;

import com.finpath.dto.*;
import com.finpath.entity.*;
import com.finpath.exception.ResourceNotFoundException;
import com.finpath.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final RoadmapTaskRepository taskRepository;
    private final FinancialGoalRepository goalRepository;
    private final OpportunityRepository opportunityRepository;

    public RoadmapService(RoadmapRepository roadmapRepository,
                          RoadmapTaskRepository taskRepository,
                          FinancialGoalRepository goalRepository,
                          OpportunityRepository opportunityRepository) {
        this.roadmapRepository = roadmapRepository;
        this.taskRepository = taskRepository;
        this.goalRepository = goalRepository;
        this.opportunityRepository = opportunityRepository;
    }

    @Transactional
    public RoadmapDto generateRoadmap(User user, GenerateRoadmapRequest request) {
        FinancialGoal goal = null;
        if (request.getGoalId() != null) {
            goal = goalRepository.findByIdAndUserId(request.getGoalId(), user.getId()).orElse(null);
        }
        if (goal == null) {
            goal = goalRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), "ACTIVE").orElse(null);
        }

        Opportunity opportunity = null;
        if (request.getOpportunityId() != null) {
            opportunity = opportunityRepository.findById(request.getOpportunityId()).orElse(null);
        }

        int durationMonths = request.getDurationMonths() != null ? request.getDurationMonths() : 6;
        String oppName = opportunity != null ? opportunity.getTitle() : "Personal Income Milestone";

        Roadmap roadmap = new Roadmap();
        roadmap.setUser(user);
        roadmap.setGoal(goal);
        roadmap.setOpportunity(opportunity);
        roadmap.setTitle(durationMonths + "-Month Action Plan: " + oppName);
        roadmap.setDurationMonths(durationMonths);
        roadmap.setStatus("ACTIVE");
        roadmap = roadmapRepository.save(roadmap);

        // Generate tasks across the 8 standard stages
        List<RoadmapTask> tasks = generateTasksForDuration(roadmap, durationMonths, oppName);
        taskRepository.saveAll(tasks);
        roadmap.setTasks(tasks);

        return mapToDto(roadmap);
    }

    public RoadmapDto getActiveRoadmap(Long userId) {
        Roadmap roadmap = roadmapRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, "ACTIVE")
                .orElse(null);
        if (roadmap == null) {
            List<Roadmap> all = roadmapRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (!all.isEmpty()) {
                roadmap = all.get(0);
            }
        }
        return roadmap != null ? mapToDto(roadmap) : null;
    }

    public RoadmapDto getRoadmapById(Long roadmapId, Long userId) {
        Roadmap roadmap = roadmapRepository.findByIdAndUserId(roadmapId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found or access denied"));
        return mapToDto(roadmap);
    }

    @Transactional
    public RoadmapTaskDto toggleTaskCompletion(Long taskId, Long userId) {
        RoadmapTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getRoadmap().getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to task");
        }

        task.setIsCompleted(!task.getIsCompleted());
        task = taskRepository.save(task);
        return mapTaskToDto(task);
    }

    @Transactional
    public RoadmapTaskDto addTask(Long roadmapId, Long userId, CreateTaskRequest request) {
        Roadmap roadmap = roadmapRepository.findByIdAndUserId(roadmapId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found"));

        RoadmapTask task = new RoadmapTask();
        task.setRoadmap(roadmap);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStage(request.getStage() != null ? request.getStage() : "Action Steps");
        task.setStageIndex(request.getStageIndex() != null ? request.getStageIndex() : 0);
        task.setTaskIndex(roadmap.getTasks().size() + 1);
        task.setDueDate(request.getDueDate() != null ? request.getDueDate() : LocalDate.now().plusWeeks(2));
        task.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        task.setEstimatedHours(request.getEstimatedHours() != null ? request.getEstimatedHours() : 2.0);
        task.setEstimatedCost(request.getEstimatedCost() != null ? request.getEstimatedCost() : BigDecimal.ZERO);
        task.setSuccessCriteria(request.getSuccessCriteria());
        task.setDependencies(request.getDependencies());
        task.setIsCompleted(false);

        task = taskRepository.save(task);
        return mapTaskToDto(task);
    }

    public List<DailyActionDto> getDailyActions(Long userId) {
        List<RoadmapTask> pending = taskRepository.findByRoadmapUserIdAndIsCompletedFalseOrderByDueDateAsc(userId);
        List<DailyActionDto> actions = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (RoadmapTask t : pending) {
            String reason = "Next milestone on your roadmap";
            if (t.getDueDate() != null) {
                if (t.getDueDate().isBefore(today)) {
                    reason = "Overdue priority task";
                } else if (t.getDueDate().isEqual(today)) {
                    reason = "Due today";
                } else if (t.getDueDate().isBefore(today.plusDays(4))) {
                    reason = "Due within this week";
                }
            }
            actions.add(new DailyActionDto(
                    t.getId(), t.getTitle(), t.getStage(), t.getPriority(),
                    t.getEstimatedHours(), t.getDueDate(), reason));

            if (actions.size() >= 3) break;
        }

        return actions;
    }

    private List<RoadmapTask> generateTasksForDuration(Roadmap roadmap, int months, String oppName) {
        List<RoadmapTask> list = new ArrayList<>();
        LocalDate start = LocalDate.now();

        // Stage 1: Understand the customer
        list.add(createTask(roadmap, "1. Understand the Customer", 0, 1,
                "Profile & List 10 Ideal Prospective Clients",
                "Define exactly who experiences the pain point for " + oppName + " and list 10 local or online prospective contacts.",
                start.plusDays(5), "HIGH", 3.0, BigDecimal.ZERO, "List of 10 targeted names/businesses with contact info"));

        // Stage 2: Validate the problem
        list.add(createTask(roadmap, "2. Validate the Problem", 1, 2,
                "Conduct 5 Customer Problem Interviews",
                "Speak directly with 5 prospects. Ask about their current friction, daily workarounds, and how often this problem occurs. Do not pitch yet.",
                start.plusDays(12), "HIGH", 5.0, BigDecimal.ZERO, "5 completed interview logs recorded in FinPath workspace"));

        // Stage 3: Test willingness to pay
        list.add(createTask(roadmap, "3. Test Willingness to Pay", 2, 3,
                "Present Value Proposition & Test Price Point",
                "Ask prospects what it costs them to leave this problem unsolved, and test if they would commit a deposit or pilot fee.",
                start.plusDays(20), "HIGH", 4.0, BigDecimal.ZERO, "At least 2 prospects indicate concrete intent or target price"));

        // Stage 4: Create a minimum viable solution
        list.add(createTask(roadmap, "4. Create MVP Solution", 3, 4,
                "Build Prototype or Service Checklist",
                "Create the simplest version of the deliverable that solves the primary issue without unnecessary complex add-ons.",
                start.plusDays(32), "MEDIUM", 12.0, new BigDecimal("3500.00"), "Working demo or documented service offering ready to deliver"));

        // Stage 5: Find initial customers
        list.add(createTask(roadmap, "5. Find Initial Customers", 4, 5,
                "Onboard 2 Founding Pilot Clients",
                "Offer a dedicated pilot onboarding with close hands-on support in exchange for detailed feedback and a case study.",
                start.plusDays(45), "HIGH", 8.0, BigDecimal.ZERO, "2 signed pilot agreements or initial payments"));

        // Stage 6: Measure costs and actual revenue
        list.add(createTask(roadmap, "6. Measure Costs & Actual Revenue", 5, 6,
                "Record Actual Delivery Hours & Cash Inflows",
                "Log all incoming revenue and software/tool costs into FinPath Transactions to measure true hourly yield and margin.",
                start.plusDays(60), "MEDIUM", 2.0, BigDecimal.ZERO, "Accurate accounting of actual profit margin"));

        // Stage 7: Improve the offer
        list.add(createTask(roadmap, "7. Improve the Offer", 6, 7,
                "Incorporate Pilot Feedback & Standardize Delivery",
                "Eliminate points of confusion, standardize templates, and refine pricing based on pilot customer testimonials.",
                start.plusDays(75), "MEDIUM", 6.0, BigDecimal.ZERO, "Standardized client onboarding guide"));

        // Stage 8: Scale only when demand and economics support it
        list.add(createTask(roadmap, "8. Scale Sustainably", 7, 8,
                "Establish Repeatable Lead Pipeline & Systems",
                "Once unit economics are validated, establish regular outreach channels, referral incentives, or automated funnels.",
                start.plusDays(months * 30L), "LOW", 10.0, new BigDecimal("7500.00"), "Predictable monthly client inquiries"));

        return list;
    }

    private RoadmapTask createTask(Roadmap roadmap, String stage, int stageIdx, int taskIdx,
                                   String title, String desc, LocalDate dueDate, String priority,
                                   Double hours, BigDecimal cost, String criteria) {
        RoadmapTask t = new RoadmapTask();
        t.setRoadmap(roadmap);
        t.setStage(stage);
        t.setStageIndex(stageIdx);
        t.setTaskIndex(taskIdx);
        t.setTitle(title);
        t.setDescription(desc);
        t.setDueDate(dueDate);
        t.setPriority(priority);
        t.setEstimatedHours(hours);
        t.setEstimatedCost(cost);
        t.setSuccessCriteria(criteria);
        t.setIsCompleted(false);
        return t;
    }

    public RoadmapDto mapToDto(Roadmap roadmap) {
        RoadmapDto dto = new RoadmapDto();
        dto.setId(roadmap.getId());
        if (roadmap.getGoal() != null) {
            dto.setGoalId(roadmap.getGoal().getId());
            dto.setGoalTitle(roadmap.getGoal().getTitle());
        }
        if (roadmap.getOpportunity() != null) {
            dto.setOpportunityId(roadmap.getOpportunity().getId());
            dto.setOpportunityTitle(roadmap.getOpportunity().getTitle());
        }
        dto.setTitle(roadmap.getTitle());
        dto.setDurationMonths(roadmap.getDurationMonths());
        dto.setStatus(roadmap.getStatus());
        dto.setCreatedAt(roadmap.getCreatedAt());

        List<RoadmapTask> tasks = roadmap.getTasks() != null ? roadmap.getTasks() : Collections.emptyList();
        dto.setTotalTasks(tasks.size());
        int completed = (int) tasks.stream().filter(RoadmapTask::getIsCompleted).count();
        dto.setCompletedTasks(completed);
        dto.setCompletionPercentage(tasks.isEmpty() ? BigDecimal.ZERO :
                BigDecimal.valueOf(completed * 100.0 / tasks.size()).setScale(1, RoundingMode.HALF_UP));

        dto.setTasks(tasks.stream().map(this::mapTaskToDto).collect(Collectors.toList()));
        return dto;
    }

    public RoadmapTaskDto mapTaskToDto(RoadmapTask task) {
        RoadmapTaskDto dto = new RoadmapTaskDto();
        dto.setId(task.getId());
        dto.setRoadmapId(task.getRoadmap().getId());
        dto.setStage(task.getStage());
        dto.setStageIndex(task.getStageIndex());
        dto.setTaskIndex(task.getTaskIndex());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setPriority(task.getPriority());
        dto.setEstimatedHours(task.getEstimatedHours());
        dto.setEstimatedCost(task.getEstimatedCost());
        dto.setIsCompleted(task.getIsCompleted());
        dto.setCompletedAt(task.getCompletedAt());
        dto.setSuccessCriteria(task.getSuccessCriteria());
        dto.setDependencies(task.getDependencies());
        return dto;
    }
}
