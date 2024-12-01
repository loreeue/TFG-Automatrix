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
    public String convertApToGic(@RequestParam("file") MultipartFile file) {
        try {
            // Convert the MultipartFile to a file and load the pushdown automaton
            File tempFile = File.createTempFile("pda", ".jff");
            file.transferTo(tempFile);
            PushdownAutomaton automaton = automataService.loadAP(tempFile.getAbsolutePath());
            // Simulate the input
            return automataService.convertAPToGIC(automaton);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/gic-to-ap")
    public String convertGicToAp(@RequestBody Grammar2Request request) {
        try {
            Grammar grammar = grammarService.parseGrammar(request.getGrammar());
            Automaton ap = automataService.convertToAutomaton(grammar);
            String outputPath = "/Users/loretouzquianoesteban/Documents/UNIVERSIDAD/CUARTO_CURSO/TFG/repo_github_2/files/files_output/gic-ap.jff";
            File outputFile = new File(outputPath);
            // Save the resulting AP to the specified path
            automataService.saveAP(ap, outputFile.getAbsolutePath());
            return "Saved new AP at: " + outputFile.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/gic-to-chomsky")
    public String convertGicToChomsky(@RequestBody Grammar2Request request) {
        try {
            Grammar grammar = grammarService.parseGrammar(request.getGrammar());
            return grammarService.transformToChomsky(grammar);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
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