package org.example.Repositories;

import org.example.Entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserId(Long userId);

	Document findByContent(byte[] content);
}
