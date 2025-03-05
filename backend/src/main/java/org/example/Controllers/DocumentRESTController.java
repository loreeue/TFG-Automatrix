package org.example.Controllers;

import org.example.Entities.Document;
import org.example.Services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentRESTController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/{userId}")
    public List<Document> getUserDocuments(@PathVariable Long userId) {
        return documentService.getDocumentsByUserId(userId);
    }

    @PostMapping("/{userId}")
    public Document uploadDocument(@PathVariable Long userId, @RequestBody Document document) {
        return documentService.saveDocument(userId, document);
    }

    @DeleteMapping("/{documentId}")
    public void deleteDocument(@PathVariable Long documentId) {
        documentService.deleteDocument(documentId);
    }
}
