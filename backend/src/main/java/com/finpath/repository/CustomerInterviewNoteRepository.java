package com.finpath.repository;

import com.finpath.entity.CustomerInterviewNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerInterviewNoteRepository extends JpaRepository<CustomerInterviewNote, Long> {
    List<CustomerInterviewNote> findByValidationIdOrderByInterviewDateDesc(Long validationId);
}
