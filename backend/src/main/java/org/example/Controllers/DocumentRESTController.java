package org.example.Controllers;

import org.example.Entities.Document;
import org.example.Services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentRESTController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/{userId}")
	public ResponseEntity<List<Document>> getUserDocuments(@PathVariable Long userId) {
		List<Document> documents = documentService.getDocumentsByUserId(userId);
		return ResponseEntity.ok(documents);
	}

    @PostMapping("/{userId}")
    public Document uploadDocument(@PathVariable Long userId, @RequestBody Document document) {
        return documentService.saveDocument(userId, document);
    }

    @DeleteMapping("/{documentId}")
    public void deleteDocument(@PathVariable Long documentId) {
        documentService.deleteDocument(documentId);
    }

	@GetMapping("/download/{documentId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long documentId) {
        Optional<Document> documentOptional = documentService.getDocumentById(documentId);
        if (documentOptional.isPresent()) {
            Document document = documentOptional.get();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(document.getContent()); // Enviamos el archivo como bytes
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
