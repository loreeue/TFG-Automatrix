package org.example.Services;

import org.example.Entities.Document;
import org.example.Entities.User;
import org.example.Repositories.DocumentRepository;
import org.example.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Document> getDocumentsByUserId(Long userId) {
        return documentRepository.findByUserId(userId);
    }

	@Transactional
    public Document saveDocument(Long userId, Document document) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            document.setUser(userOptional.get());
            return documentRepository.save(document);
        }
        throw new RuntimeException("Usuario no encontrado");
    }

    public void deleteDocument(Long documentId) {
        documentRepository.deleteById(documentId);
    }

	public Optional<Document> getDocumentById(Long documentId) {
        return documentRepository.findById(documentId);
    }

	public Document findDocumentByContent(byte[] content) {
        List<Document> documents = documentRepository.findAll();
        for (Document doc : documents) {
            if (Arrays.equals(doc.getContent(), content)) {
                return doc;
            }
        }
        return null;
    }
}
