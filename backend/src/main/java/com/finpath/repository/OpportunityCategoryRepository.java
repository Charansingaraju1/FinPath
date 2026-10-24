package com.finpath.repository;

import com.finpath.entity.OpportunityCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OpportunityCategoryRepository extends JpaRepository<OpportunityCategory, Long> {
    Optional<OpportunityCategory> findBySlug(String slug);
}
