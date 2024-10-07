package org.example.Controllers;

import automata.pda.PushdownAutomaton;
import automata.turing.TuringMachine;
import automata.fsa.FiniteStateAutomaton;
import org.example.Services.AutomataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;

@RestController
@RequestMapping("/api/validate")
public class AutomataSimulatorRESTController {

    @Autowired
    private AutomataService automataService;

    @PostMapping("/afd")
    public String simulateAFD(@RequestParam("file") MultipartFile file, @RequestParam("input") String input) {
        try {
            // Convert the MultipartFile to a file and load the automaton
            File tempFile = File.createTempFile("afd", ".jff");
            file.transferTo(tempFile);
            FiniteStateAutomaton automaton = automataService.loadAFD(tempFile.getAbsolutePath());
            // Simulate the input
            boolean result = automataService.simulateAFD(automaton, input);
            return result ? "Accepted" : "No accepted";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/afnd")
    public String simulateAFND(@RequestParam("file") MultipartFile file, @RequestParam("input") String input) {
        try {
            // Convert the MultipartFile to a file and load the automaton
            File tempFile = File.createTempFile("afnd", ".jff");
            file.transferTo(tempFile);
            FiniteStateAutomaton automaton = automataService.loadAFND(tempFile.getAbsolutePath());
            // Simulate the input
            boolean result = automataService.simulateAFND(automaton, input);
            return result ? "Accepted" : "No accepted";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/turingMachine")
    public String simulateTuringMachine(@RequestParam("file") MultipartFile file, @RequestParam("input") String input) {
        try {
            // Convert the MultipartFile to a file and load the turing machine
            File tempFile = File.createTempFile("turingMachine", ".jff");
            file.transferTo(tempFile);
            TuringMachine turingMachine = automataService.loadTuringMachine(tempFile.getAbsolutePath());
            // Simulate the input
            boolean result = automataService.simulateTuringMachine(turingMachine, input);
            return result ? "Accepted" : "No accepted";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/ap")
    public String simulateAP(@RequestParam("file") MultipartFile file, @RequestParam("input") String input) {
        try {
            // Convert the MultipartFile to a file and load the pushdown automaton
            File tempFile = File.createTempFile("pda", ".jff");
            file.transferTo(tempFile);
            PushdownAutomaton automaton = automataService.loadAP(tempFile.getAbsolutePath());
            // Simulate the input
            boolean result = automataService.simulateAP(automaton, input);
            return result ? "Accepted" : "No accepted";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}