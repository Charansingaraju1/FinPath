package com.finpath.repository;

import com.finpath.entity.FinancialGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialGoalRepository extends JpaRepository<FinancialGoal, Long> {
    List<FinancialGoal> findByUserIdOrderByDeadlineAsc(Long userId);
    Optional<FinancialGoal> findFirstByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
    Optional<FinancialGoal> findByIdAndUserId(Long id, Long userId);
}
