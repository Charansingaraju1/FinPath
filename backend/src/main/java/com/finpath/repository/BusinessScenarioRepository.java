package com.finpath.repository;

import com.finpath.entity.BusinessScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessScenarioRepository extends JpaRepository<BusinessScenario, Long> {
    List<BusinessScenario> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<BusinessScenario> findByUserIdAndOpportunityId(Long userId, Long opportunityId);
    Optional<BusinessScenario> findByIdAndUserId(Long id, Long userId);
}
