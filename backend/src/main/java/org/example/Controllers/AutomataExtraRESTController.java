package org.example.Controllers;

import automata.fsa.FiniteStateAutomaton;
import org.example.Entities.Document;
import org.example.Services.AutomataService;
import org.example.Services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;

@RestController
@RequestMapping("/api/extra")
public class AutomataExtraRESTController {

    @Autowired
    private AutomataService automataService;

	@Autowired
	private DocumentService documentService;

	@PostMapping("/compare-afds")
	public String compareAfds(
			@RequestParam("file1") MultipartFile file1,
			@RequestParam("file2") MultipartFile file2,
			@RequestParam("userId") Long userId) {
		try {
			System.out.println("User ID recibido: " + userId);

			// Obtain content of the files
			byte[] file1Content = file1.getBytes();
			byte[] file2Content = file2.getBytes();

			// Verify if the documents already exist
			Document existingDocument1 = documentService.findDocumentByContent(file1Content);
			Document existingDocument2 = documentService.findDocumentByContent(file2Content);

			Document document1;
			Document document2;

			if (existingDocument1 != null) {
				document1 = existingDocument1;
			} else {
				document1 = new Document();
				document1.setName(file1.getOriginalFilename());
				document1.setContent(file1Content);
				document1 = documentService.saveDocument(userId, document1);
			}

			if (existingDocument2 != null) {
				document2 = existingDocument2;
			} else {
				document2 = new Document();
				document2.setName(file2.getOriginalFilename());
				document2.setContent(file2Content);
				document2 = documentService.saveDocument(userId, document2);
			}

			// Convert MultipartFiles to temporary files
			File tempFile1 = File.createTempFile("afd1", ".jff");
			file1.transferTo(tempFile1);
			File tempFile2 = File.createTempFile("afd2", ".jff");
			file2.transferTo(tempFile2);

			// Load both AFDs
			FiniteStateAutomaton afd1 = automataService.loadAFD(tempFile1.getAbsolutePath());
			FiniteStateAutomaton afd2 = automataService.loadAFD(tempFile2.getAbsolutePath());
			if (afd1 == null || afd2 == null) {
				return "Error";
			}

			// Minimize both AFDs
			FiniteStateAutomaton minimizedAfd1 = automataService.minimize(afd1);
			FiniteStateAutomaton minimizedAfd2 = automataService.minimize(afd2);

			// Compare the minimized AFDs
			boolean areEquivalent = automataService.areEquivalent(minimizedAfd1, minimizedAfd2);
			if (areEquivalent) {
				return "Los dos AFDs sí son equivalentes.";
			} else {
				return "Los dos AFDs no son equivalentes.";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "Error: " + e.getMessage();
		}
	}
}
