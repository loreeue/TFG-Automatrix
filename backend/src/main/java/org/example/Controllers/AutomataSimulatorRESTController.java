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
    public boolean simulateAFD(@RequestParam("file") MultipartFile file, @RequestParam("input") String input) {
        try {
            // Convert the MultipartFile to a file and load the automaton
            File tempFile = File.createTempFile("afd", ".jff");
            file.transferTo(tempFile);
            FiniteStateAutomaton automaton = automataService.loadAFD(tempFile.getAbsolutePath());
            if (automaton == null) {
                return false;
            }
            // Simulate the input
            return automataService.simulateAFD(automaton, input);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @PostMapping("/afnd")
    public boolean simulateAFND(@RequestParam("file") MultipartFile file, @RequestParam("input") String input) {
        try {
            // Convert the MultipartFile to a file and load the automaton
            File tempFile = File.createTempFile("afnd", ".jff");
            file.transferTo(tempFile);
            FiniteStateAutomaton automaton = automataService.loadAFND(tempFile.getAbsolutePath());
            if (automaton == null) {
                return false;
            }
            // Simulate the input
            return automataService.simulateAFND(automaton, input);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @PostMapping("/turingMachine")
    public boolean simulateTuringMachine(@RequestParam("file") MultipartFile file, @RequestParam("input") String input) {
        try {
            // Convert the MultipartFile to a file and load the turing machine
            File tempFile = File.createTempFile("turingMachine", ".jff");
            file.transferTo(tempFile);
            TuringMachine turingMachine = automataService.loadTuringMachine(tempFile.getAbsolutePath());
            if (turingMachine == null) {
                return false;
            }
            // Simulate the input
            return automataService.simulateTuringMachine(turingMachine, input);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @PostMapping("/ap")
    public boolean simulateAP(@RequestParam("file") MultipartFile file, @RequestParam("input") String input) {
        try {
            // Convert the MultipartFile to a file and load the pushdown automaton
            File tempFile = File.createTempFile("pda", ".jff");
            file.transferTo(tempFile);
            PushdownAutomaton automaton = automataService.loadAP(tempFile.getAbsolutePath());
            if (automaton == null) {
                return false;
            }
            // Simulate the input
            return automataService.simulateAP(automaton, input);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
