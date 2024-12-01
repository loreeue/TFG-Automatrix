package org.example.Controllers;

import automata.Automaton;
import automata.fsa.FSAToRegularExpressionConverter;
import automata.fsa.FiniteStateAutomaton;
import automata.pda.PushdownAutomaton;
import grammar.Grammar;
import grammar.cfg.CFGToPDALLConverter;
import org.example.Entities.AutomatonUtils;
import org.example.Entities.Grammar2Request;
import org.example.Services.AutomataService;
import org.example.Services.GrammarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import regular.RegularExpression;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.io.File;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import java.nio.file.Path;
import java.io.FileWriter;

@RestController
@RequestMapping("/api/convert")
public class AutomataTransformerRESTController {

    @Autowired
    private AutomataService automataService;

    @Autowired
    private GrammarService grammarService;

    @PostMapping("/afnd-to-afd")
    public ResponseEntity<Resource> convertAfndToAfd(@RequestParam("file") MultipartFile file) {
        try {
            // Convert MultipartFile to a temporary file
            File tempFile = File.createTempFile("afnd", ".jff");
            file.transferTo(tempFile);

            // Load the AFND (NFA)
            FiniteStateAutomaton afnd = automataService.loadAFND(tempFile.getAbsolutePath());

            // Convert AFND to AFD (DFA)
            FiniteStateAutomaton afd = automataService.convertAFNDToAFD(afnd);

            // Save the resulting AFD to a file
            String outputPath = "/Users/loretouzquianoesteban/Documents/UNIVERSIDAD/CUARTO_CURSO/TFG/repo_github_2/files/files_output/afd.jff";
            File outputFile = new File(outputPath);
            automataService.saveAFND(afd, outputFile.getAbsolutePath());

            // Prepare the file as a downloadable resource
            Path filePath = outputFile.toPath();
            Resource resource = new FileSystemResource(filePath);

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
    public ResponseEntity<Resource> convertAfdToMinimizedAfd(@RequestParam("file") MultipartFile file) {
        try {
            // Convert MultipartFile to a temporary file
            File tempFile = File.createTempFile("afd", ".jff");
            file.transferTo(tempFile);

            // Load the AFD
            FiniteStateAutomaton afd = automataService.loadAFD(tempFile.getAbsolutePath());

            // Minimize the AFD
            FiniteStateAutomaton minimizedAfd = automataService.minimize(afd);

            // Save the resulting minimized AFD to a file
            String outputPath = "/Users/loretouzquianoesteban/Documents/UNIVERSIDAD/CUARTO_CURSO/TFG/repo_github_2/files/files_output/afd_minimized.jff";
            File outputFile = new File(outputPath);
            automataService.saveAFND(minimizedAfd, outputFile.getAbsolutePath());

            // Serve the file as a downloadable resource
            Path filePath = outputFile.toPath();
            Resource resource = new FileSystemResource(filePath);

            // Use correct MIME type for .jff
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
    public ResponseEntity<Resource> convertApToGic(@RequestParam("file") MultipartFile file) {
        try {
            // Convert the MultipartFile to a temporary file
            File tempFile = File.createTempFile("pda", ".jff");
            file.transferTo(tempFile);

            // Load the Pushdown Automaton from the file
            PushdownAutomaton automaton = automataService.loadAP(tempFile.getAbsolutePath());

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
    public ResponseEntity<Resource> convertGicToAp(@RequestBody Grammar2Request request) {
        try {
            // Parse the grammar provided in the request
            Grammar grammar = grammarService.parseGrammar(request.getGrammar());

            // Convert the grammar to a Pushdown Automaton (AP)
            Automaton ap = automataService.convertToAutomaton(grammar);

            // Save the resulting AP as a .jff file
            String outputPath = "/Users/loretouzquianoesteban/Documents/UNIVERSIDAD/CUARTO_CURSO/TFG/repo_github_2/files/files_output/gic_to_ap.jff";
            File outputFile = new File(outputPath);
            automataService.saveAP(ap, outputFile.getAbsolutePath());

            // Create a resource for the saved file
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
    public ResponseEntity<String> convertAfdToEr(@RequestParam("file") MultipartFile file) {
        try {
            // Save uploaded file as a temporary file
            File tempFile = File.createTempFile("afd", ".jff");
            file.transferTo(tempFile);

            // Load the AFD from the temporary file
            FiniteStateAutomaton afd = automataService.loadAFND(tempFile.getAbsolutePath());

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
    public ResponseEntity<Resource> convertGldToAfd(@RequestBody Grammar2Request request) {
        try {
            // Parse the grammar received in the request
            Grammar grammar = grammarService.parseGrammar(request.getGrammar());

            // Convert the given GLD (Right-Linear Grammar) to an AFD (Deterministic Finite Automaton)
            FiniteStateAutomaton afd = automataService.convertGLDToAFD(grammar);

            // Save the resulting AFD into a .jff file
            String outputPath = "/Users/loretouzquianoesteban/Documents/UNIVERSIDAD/CUARTO_CURSO/TFG/repo_github_2/files/files_output/gld-afd.jff";
            File outputFile = new File(outputPath);
            automataService.saveAFND(afd, outputFile.getAbsolutePath());

            // Prepare the file as a downloadable resource
            Resource resource = new FileSystemResource(outputFile);

            // Return the file as a downloadable resource with appropriate headers
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + outputFile.getName()) // Define download filename
                    .contentType(MediaType.APPLICATION_XML) // Set the correct MIME type for .jff files
                    .body(resource);
        } catch (Exception e) {
            // Print the exception stack trace for debugging purposes
            e.printStackTrace();

            // Return a 500 Internal Server Error response in case of failure
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}