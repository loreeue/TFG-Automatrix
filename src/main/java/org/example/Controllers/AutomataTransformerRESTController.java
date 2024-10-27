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

import java.io.File;

@RestController
@RequestMapping("/api/convert")
public class AutomataTransformerRESTController {

    @Autowired
    private AutomataService automataService;

    @Autowired
    private GrammarService grammarService;

    @PostMapping("/afnd-to-afd")
    public String convertAfndToAfd(@RequestParam("file") MultipartFile file) {
        try {
            // Convert MultipartFile to a temporary file
            File tempFile = File.createTempFile("afnd", ".jff");
            file.transferTo(tempFile);
            // Load the NFA
            FiniteStateAutomaton afnd = automataService.loadAFND(tempFile.getAbsolutePath());
            // Convert NFA to DFA
            FiniteStateAutomaton afd = automataService.convertAFNDToAFD(afnd);
            // Save the resulting DFA to a file
            String outputPath = "/Users/loretouzquianoesteban/Documents/UNIVERSIDAD/CUARTO_CURSO/TFG/repo_github/src/main/java/org/example/Files_Output/afd.jff";
            File outputFile = new File(outputPath);
            // Save the resulting DFA to the specified path
            automataService.saveAFND(afd, outputFile.getAbsolutePath());
            return "DFA successfully created and saved at: " + outputFile.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/afd-to-minimized-afd")
    public String convertAfdToMinimizedAfd(@RequestParam("file") MultipartFile file) {
        try {
            // Convert MultipartFile to a temporary file
            File tempFile = File.createTempFile("afd", ".jff");
            file.transferTo(tempFile);
            // Load the AFD
            FiniteStateAutomaton afd = automataService.loadAFD(tempFile.getAbsolutePath());
            // Minimize the AFD
            FiniteStateAutomaton minimizedAfd = automataService.minimize(afd);
            // Save the resulting minimized AFD to a file
            String outputPath = "/Users/loretouzquianoesteban/Documents/UNIVERSIDAD/CUARTO_CURSO/TFG/repo_github/src/main/java/org/example/Files_Output/afd_minimized.jff";
            File outputFile = new File(outputPath);
            // Save the resulting DFA to the specified path
            automataService.saveAFND(minimizedAfd, outputFile.getAbsolutePath());
            return "Minimized AFD successfully created and saved at: " + outputFile.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
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
            String outputPath = "/Users/loretouzquianoesteban/Documents/UNIVERSIDAD/CUARTO_CURSO/TFG/repo_github/src/main/java/org/example/Files_Output/gic-ap.jff";
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
    public String convertAfdToEr(@RequestParam("file") MultipartFile file) {
        try {
            File tempFile = File.createTempFile("afd", ".jff");
            file.transferTo(tempFile);
            // Load the NFA
            FiniteStateAutomaton afd = automataService.loadAFND(tempFile.getAbsolutePath());
            // Auxiliar comprobation
            AutomatonUtils.ensureCompleteTransitions(afd);
            // Convert NFA to ER
            if (!FSAToRegularExpressionConverter.isConvertable(afd)) {
                return "El autómata no se puede convertir a una expresión regular.";
            }
            return automataService.convertAFDToER(afd);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}