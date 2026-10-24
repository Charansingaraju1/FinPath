package com.finpath.repository;

import com.finpath.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    List<Roadmap> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Roadmap> findFirstByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
    Optional<Roadmap> findByIdAndUserId(Long id, Long userId);
}
