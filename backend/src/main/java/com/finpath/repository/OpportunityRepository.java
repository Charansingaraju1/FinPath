package com.finpath.repository;

import com.finpath.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByIsApprovedTrueOrderByBaseFitScoreDesc();
    List<Opportunity> findByIsFeaturedTrueAndIsApprovedTrue();

    @Query("SELECT o FROM Opportunity o WHERE o.isApproved = true AND " +
           "(:query IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.targetCustomer) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.requiredSkills) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:categoryId IS NULL OR o.category.id = :categoryId) AND " +
           "(:difficulty IS NULL OR o.difficulty = :difficulty) AND " +
           "(:validationStatus IS NULL OR o.validationStatus = :validationStatus)")
    List<Opportunity> searchOpportunities(
        @Param("query") String query,
        @Param("categoryId") Long categoryId,
        @Param("difficulty") String difficulty,
        @Param("validationStatus") String validationStatus
    );

    List<Opportunity> findByCreatedByUserIdOrderByCreatedAtDesc(Long userId);
}
