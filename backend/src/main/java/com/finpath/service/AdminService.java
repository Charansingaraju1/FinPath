package com.finpath.service;

import com.finpath.entity.Opportunity;
import com.finpath.entity.OpportunityCategory;
import com.finpath.exception.ResourceNotFoundException;
import com.finpath.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private final OpportunityRepository opportunityRepository;
    private final OpportunityCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OpportunityValidationRepository validationRepository;

    public AdminService(OpportunityRepository opportunityRepository,
                        OpportunityCategoryRepository categoryRepository,
                        UserRepository userRepository,
                        OpportunityValidationRepository validationRepository) {
        this.opportunityRepository = opportunityRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.validationRepository = validationRepository;
    }

    public Map<String, Object> getAggregateMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", userRepository.count());
        metrics.put("totalOpportunities", opportunityRepository.count());
        metrics.put("approvedOpportunities", opportunityRepository.findByIsApprovedTrueOrderByBaseFitScoreDesc().size());
        metrics.put("totalValidationsInProgress", validationRepository.count());
        metrics.put("categoriesCount", categoryRepository.count());
        return metrics;
    }

    public List<Opportunity> getAllOpportunitiesForAdmin() {
        return opportunityRepository.findAll();
    }

    @Transactional
    public Opportunity toggleOpportunityApproval(Long id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found"));
        opp.setIsApproved(!opp.getIsApproved());
        return opportunityRepository.save(opp);
    }

    @Transactional
    public OpportunityCategory createCategory(String name, String slug, String description, String icon) {
        OpportunityCategory cat = new OpportunityCategory();
        cat.setName(name);
        cat.setSlug(slug);
        cat.setDescription(description);
        cat.setIcon(icon);
        return categoryRepository.save(cat);
    }
}
