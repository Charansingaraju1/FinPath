package com.finpath.repository;

import com.finpath.entity.OpportunityValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OpportunityValidationRepository extends JpaRepository<OpportunityValidation, Long> {
    Optional<OpportunityValidation> findByUserIdAndOpportunityId(Long userId, Long opportunityId);
    List<OpportunityValidation> findByUserIdOrderByUpdatedAtDesc(Long userId);
}
