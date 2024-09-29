package org.example.Controllers;

import automata.fsa.FiniteStateAutomaton;
import org.example.Services.AutomataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api/convert")
public class AutomataTransformerRESTController {

    @Autowired
    private AutomataService automataService;

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
            // Guardar el DFA resultante en la ruta especificada
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
            // Guardar el AFD minimizado en la ruta especificada
            automataService.saveAFND(minimizedAfd, outputFile.getAbsolutePath());
            return "Minimized AFD successfully created and saved at: " + outputFile.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

}
