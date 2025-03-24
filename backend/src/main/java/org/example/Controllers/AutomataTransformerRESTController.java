package org.example.Controllers;

import automata.Automaton;
import automata.fsa.FSAToRegularExpressionConverter;
import automata.fsa.FiniteStateAutomaton;
import automata.pda.PushdownAutomaton;
import grammar.Grammar;
import org.example.Entities.AutomatonUtils;
import org.example.Entities.Document;
import org.example.Entities.Grammar2Request;
import org.example.Services.AutomataService;
import org.example.Services.DocumentService;
import org.example.Services.GrammarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import java.io.File;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import java.nio.file.Files;
import java.io.FileWriter;

@RestController
@RequestMapping("/api/convert")
public class AutomataTransformerRESTController {

    @Autowired
    private AutomataService automataService;

    @Autowired
    private GrammarService grammarService;

	@Autowired
	private DocumentService documentService;

	@Value("${file.output.dir}")
	private String fileOutputDir;

    @PostMapping("/afnd-to-afd")
    public ResponseEntity<Resource> convertAfndToAfd(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId) {
        try {
			Document originalDocument = new Document();
 			originalDocument.setName(file.getOriginalFilename());
 			originalDocument.setContent(file.getBytes());
 			originalDocument = documentService.saveDocument(userId, originalDocument);

            // Convert MultipartFile to a temporary file
            File tempFile = File.createTempFile("afnd", ".jff");
            file.transferTo(tempFile);

            // Load the AFND (NFA)
            FiniteStateAutomaton afnd = automataService.loadAFND(tempFile.getAbsolutePath());
            if (afnd == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null);
            }

            // Convert AFND to AFD (DFA)
            FiniteStateAutomaton afd = automataService.convertAFNDToAFD(afnd);

			File afdTempFile = File.createTempFile("afd_from_afnd", ".jff");
 			automataService.saveAFND(afd, afdTempFile.getAbsolutePath());

 			// Leer el contenido del archivo minimizado en un array de bytes
 			byte[] afdContent = Files.readAllBytes(afdTempFile.toPath());

 			// Save the minimized AFD to the database
 			Document afdDocument = new Document();
 			afdDocument.setName("afd_from_afnd.jff");
 			afdDocument.setContent(afdContent);
 			afdDocument = documentService.saveDocument(userId, afdDocument);

            // Save the resulting AFD to a file
			File outputFile = File.createTempFile("afd_minimized", ".jff");
            automataService.saveAFND(afd, outputFile.getAbsolutePath());

            // Prepare the file as a downloadable resource
			Resource resource = new FileSystemResource(outputFile);

            // Serve the file as a response with proper headers
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + outputFile.getName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/afd-to-minimized-afd")
    public ResponseEntity<Resource> convertAfdToMinimizedAfd(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId) {
        try {
			Document originalDocument = new Document();
			originalDocument.setName(file.getOriginalFilename());
			originalDocument.setContent(file.getBytes());
			originalDocument = documentService.saveDocument(userId, originalDocument);

            // Convert MultipartFile to a temporary file
            File tempFile = File.createTempFile("afd", ".jff");
            file.transferTo(tempFile);

            // Load the AFD
            FiniteStateAutomaton afd = automataService.loadAFD(tempFile.getAbsolutePath());
            if (afd == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null);
            }

            // Minimize the AFD
            FiniteStateAutomaton minimizedAfd = automataService.minimize(afd);

			File minimizedTempFile = File.createTempFile("afd_minimized", ".jff");
			automataService.saveAFND(minimizedAfd, minimizedTempFile.getAbsolutePath());

			// Read the content of the minimized file into a byte array
			byte[] minimizedContent = Files.readAllBytes(minimizedTempFile.toPath());

			// Save the minimized AFD to the database
			Document minimizedDocument = new Document();
			minimizedDocument.setName("afd_minimized.jff");
			minimizedDocument.setContent(minimizedContent);
			minimizedDocument = documentService.saveDocument(userId, minimizedDocument);

            // Save the resulting minimized AFD to a file
			File outputFile = File.createTempFile("afd", ".jff");
            automataService.saveAFND(minimizedAfd, outputFile.getAbsolutePath());

            // Prepare the file as a downloadable resource
			Resource resource = new FileSystemResource(outputFile);

            // Serve the file as a response with proper headers
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + outputFile.getName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM) // For file download
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/ap-to-gic")
    public ResponseEntity<Resource> convertApToGic(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId) {
        try {
			Document originalDocument = new Document();
 			originalDocument.setName(file.getOriginalFilename());
 			originalDocument.setContent(file.getBytes());
 			originalDocument = documentService.saveDocument(userId, originalDocument);

            // Convert the MultipartFile to a temporary file
            File tempFile = File.createTempFile("pda", ".jff");
            file.transferTo(tempFile);

            // Load the Pushdown Automaton from the file
            PushdownAutomaton automaton = automataService.loadAP(tempFile.getAbsolutePath());
            if (automaton == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null);
            }

            // Convert the AP to a GIC (Grammar Independently Contextual)
            String gicRepresentation = automataService.convertAPToGIC(automaton);

            // Save the GIC to a temporary file
            File outputFile = File.createTempFile("ap_to_gic", ".txt");
            try (FileWriter writer = new FileWriter(outputFile)) {
                writer.write(gicRepresentation);
            }

            // Prepare the file as a downloadable resource
            Resource resource = new FileSystemResource(outputFile);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + outputFile.getName())
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/gic-to-ap")
    public ResponseEntity<Resource> convertGicToAp(@RequestBody Grammar2Request request, @RequestParam("userId") Long userId) {
        try {
            // Parse the grammar provided in the request
            Grammar grammar = grammarService.parseGrammar(request.getGrammar());

            // Convert the grammar to a Pushdown Automaton (AP)
            Automaton ap = automataService.convertToAutomaton(grammar);

			File apTempFile = File.createTempFile("ap_from_gic", ".jff");
 			automataService.saveAP(ap, apTempFile.getAbsolutePath());

 			// Read the content of the minimized file into a byte array
 			byte[] apContent = Files.readAllBytes(apTempFile.toPath());

 			// Save the minimized AFD to the database
 			Document apDocument = new Document();
 			apDocument.setName("ap_from_gic.jff");
 			apDocument.setContent(apContent);
 			apDocument = documentService.saveDocument(userId, apDocument);

            // Save the resulting AP as a .jff file
			File outputFile = File.createTempFile("ap_from_gic", ".jff");
            automataService.saveAP(ap, outputFile.getAbsolutePath());

            // Prepare the file as a downloadable resource
			Resource resource = new FileSystemResource(outputFile);

            // Return the file as a downloadable resource
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + outputFile.getName())
                    .contentType(MediaType.APPLICATION_XML)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/gic-to-chomsky")
    public ResponseEntity<Resource> convertGicToChomsky(@RequestBody Grammar2Request request) {
        try {
            // Parse the input grammar
            Grammar grammar = grammarService.parseGrammar(request.getGrammar());

            // Transform the grammar to Chomsky Normal Form
            String transformedGrammar = grammarService.transformToChomsky(grammar);

            // Save the transformed grammar to a temporary file
            File tempFile = File.createTempFile("chomsky_", ".txt");
            try (FileWriter writer = new FileWriter(tempFile)) {
                writer.write(transformedGrammar);
            }

            // Create a resource for the file
            Resource resource = new FileSystemResource(tempFile);

            // Send the file as a downloadable response
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=chomsky_grammar.txt")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/afd-to-er")
    public ResponseEntity<String> convertAfdToEr(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId) {
        try {
			Document originalDocument = new Document();
 			originalDocument.setName(file.getOriginalFilename());
 			originalDocument.setContent(file.getBytes());
 			originalDocument = documentService.saveDocument(userId, originalDocument);

            // Save uploaded file as a temporary file
            File tempFile = File.createTempFile("afd", ".jff");
            file.transferTo(tempFile);

            // Load the AFD from the temporary file
            FiniteStateAutomaton afd = automataService.loadAFND(tempFile.getAbsolutePath());
            if (afd == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null);
            }

            // Ensure transitions are complete (auxiliary validation)
            AutomatonUtils.ensureCompleteTransitions(afd);

            // Check if the automaton can be converted to a regular expression
            if (!FSAToRegularExpressionConverter.isConvertable(afd)) {
                return ResponseEntity.ok("El autómata no se puede convertir a una expresión regular.");
            }

            // Convert AFD to a regular expression
            String regularExpression = automataService.convertAFDToER(afd);

            // Return the generated regular expression as a response
            return ResponseEntity.ok(regularExpression);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/gld-to-afd")
    public ResponseEntity<Resource> convertGldToAfd(@RequestBody Grammar2Request request, @RequestParam("userId") Long userId) {
        try {
            // Parse the grammar received in the request
            Grammar grammar = grammarService.parseGrammar(request.getGrammar());

            // Convert the given GLD (Right-Linear Grammar) to an AFD (Deterministic Finite Automaton)
            FiniteStateAutomaton afd = automataService.convertGLDToAFD(grammar);

			File afdTempFile = File.createTempFile("afd_from_gld", ".jff");
 			automataService.saveAFND(afd, afdTempFile.getAbsolutePath());

 			// Read the content of the minimized file into a byte array
 			byte[] afdContent = Files.readAllBytes(afdTempFile.toPath());

 			// Save the minimized AFD to the database
 			Document afdDocument = new Document();
 			afdDocument.setName("afd_from_gld.jff");
 			afdDocument.setContent(afdContent);
 			afdDocument = documentService.saveDocument(userId, afdDocument);

            // Save the resulting AFD into a .jff file
			File outputFile = File.createTempFile("afd", ".jff");
            automataService.saveAP(afd, outputFile.getAbsolutePath());

            // Prepare the file as a downloadable resource
			Resource resource = new FileSystemResource(outputFile);

            // Return the file as a downloadable resource with appropriate headers
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + outputFile.getName()) // Define download filename
                    .contentType(MediaType.APPLICATION_XML) // Set the correct MIME type for .jff files
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
