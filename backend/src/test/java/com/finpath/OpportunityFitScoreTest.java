package com.finpath;

import com.finpath.entity.FinancialProfile;
import com.finpath.entity.Opportunity;
import com.finpath.entity.UserProfile;
import com.finpath.service.OpportunityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class OpportunityFitScoreTest {

    private OpportunityService opportunityService;

    @BeforeEach
    void setUp() {
        opportunityService = new OpportunityService(null, null, null, null, null);
    }

    @Test
    @DisplayName("Should reward strong skill and budget match with high fit score")
    void testCalculateUserFitScore_HighMatch() {
        Opportunity opp = new Opportunity();
        opp.setBaseFitScore(85);
        opp.setInitialCostMin(new BigDecimal("100.00"));
        opp.setInitialCostMax(new BigDecimal("300.00"));
        opp.setRequiredSkills("HTML, React, CSS, design");

        UserProfile profile = new UserProfile();
        profile.setAvailableHoursPerWeek(20);
        profile.setSkills("React, CSS, web development");

        FinancialProfile finProfile = new FinancialProfile();
        finProfile.setAvailableStartupBudget(new BigDecimal("1000.00")); // exceeds max cost

        int score = opportunityService.calculateUserFitScore(opp, profile, finProfile);
        assertTrue(score >= 80, "Fit score should be high for aligned profile");
    }

    @Test
    @DisplayName("Should reduce fit score when user has limited budget and hours")
    void testCalculateUserFitScore_ConstrainedProfile() {
        Opportunity opp = new Opportunity();
        opp.setBaseFitScore(75);
        opp.setInitialCostMin(new BigDecimal("500.00"));
        opp.setInitialCostMax(new BigDecimal("1500.00"));
        opp.setRequiredSkills("Java, Spring, DevOps");

        UserProfile profile = new UserProfile();
        profile.setAvailableHoursPerWeek(4); // low
        profile.setSkills("Writing, photography"); // zero skill match

        FinancialProfile finProfile = new FinancialProfile();
        finProfile.setAvailableStartupBudget(new BigDecimal("50.00")); // below min cost

        int score = opportunityService.calculateUserFitScore(opp, profile, finProfile);
        assertTrue(score < 60, "Fit score should be constrained when skills and budget do not match");
    }
}
