package com.finpath.repository;

import com.finpath.entity.RoadmapTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoadmapTaskRepository extends JpaRepository<RoadmapTask, Long> {
    List<RoadmapTask> findByRoadmapIdOrderByStageIndexAscTaskIndexAsc(Long roadmapId);
    List<RoadmapTask> findByRoadmapUserIdAndIsCompletedFalseOrderByDueDateAsc(Long userId);
    List<RoadmapTask> findByRoadmapUserIdAndDueDateLessThanEqualAndIsCompletedFalse(Long userId, LocalDate date);
}
