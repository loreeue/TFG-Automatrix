package org.example.Services;

import automata.*;
import automata.fsa.FiniteStateAutomaton;
import automata.fsa.Minimizer;
import automata.fsa.NFAToDFA;
import automata.pda.PushdownAutomaton;
import automata.turing.TuringMachine;
import file.XMLCodec;
import org.springframework.stereotype.Service;
import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

@Service
public class AutomataService {

    public AutomataService() {
    }

    public FiniteStateAutomaton loadAFD(String filePath) throws Exception {
        XMLCodec codec = new XMLCodec();
        return (FiniteStateAutomaton) codec.decode(new File(filePath), null);
    }

    public boolean simulateAFD(FiniteStateAutomaton automaton, String input) throws Exception {
        AutomatonSimulator simulator = SimulatorFactory.getSimulator(automaton);
        if (simulator == null) throw new RuntimeException("Cannot load a simulator for this automaton.");
        return simulator.simulateInput(input);
    }

    public FiniteStateAutomaton loadAFND(String filePath) throws Exception {
        XMLCodec codec = new XMLCodec();
        return (FiniteStateAutomaton) codec.decode(new File(filePath), null);
    }

    public boolean simulateAFND(FiniteStateAutomaton automaton, String input) throws Exception {
        AutomatonSimulator simulator = SimulatorFactory.getSimulator(automaton);
        if (simulator == null) throw new RuntimeException("Cannot load a simulator for this automaton.");
        return simulator.simulateInput(input);
    }

    public TuringMachine loadTuringMachine(String filePath) throws Exception {
        XMLCodec codec = new XMLCodec();
        return (TuringMachine) codec.decode(new File(filePath), null);
    }

    public boolean simulateTuringMachine(TuringMachine automaton, String input) throws Exception {
        AutomatonSimulator simulator = SimulatorFactory.getSimulator(automaton);
        if (simulator == null) throw new RuntimeException("Cannot load a simulator for this automaton.");
        return simulator.simulateInput(input);
    }

    public PushdownAutomaton loadAP(String filePath) throws Exception {
        XMLCodec codec = new XMLCodec();
        return (PushdownAutomaton) codec.decode(new File(filePath), null);
    }

    public boolean simulateAP(PushdownAutomaton automaton, String input) throws Exception {
        AutomatonSimulator simulator = SimulatorFactory.getSimulator(automaton);
        if (simulator == null) throw new RuntimeException("Cannot load a simulator for this automaton.");
        return simulator.simulateInput(input);
    }

    public FiniteStateAutomaton convertAFNDToAFD(FiniteStateAutomaton nfa) {
        NFAToDFA converter = new NFAToDFA();
        return converter.convertToDFA(nfa);
    }

    public FiniteStateAutomaton minimize(FiniteStateAutomaton dfa) {
        Minimizer minimizer = new Minimizer();
        return (FiniteStateAutomaton) minimizer.getMinimizeableAutomaton(dfa);
    }

    public void saveAFND(FiniteStateAutomaton dfa, String filePath) {
        XMLCodec codec = new XMLCodec();
        codec.encode(dfa, new File(filePath), new HashMap<>());
    }

    public boolean areEquivalent(FiniteStateAutomaton afd1, FiniteStateAutomaton afd2) {
        // 1. Comprobar si tienen el mismo número de estados
        if (afd1.getStates().length != afd2.getStates().length) {
            return false;
        }

        // 2. Comprobar si tienen el mismo número de transiciones
        if (afd1.getTransitions().length != afd2.getTransitions().length) {
            return false;
        }

        // 3. Comprobar si tienen los mismos estados de aceptación
        State[] acceptingStates1 = afd1.getFinalStates();
        State[] acceptingStates2 = afd2.getFinalStates();

        if (acceptingStates1.length != acceptingStates2.length) {
            return false;
        }

        Set<State> acceptingStatesSet1 = new HashSet<>(Arrays.asList(acceptingStates1));
        Set<State> acceptingStatesSet2 = new HashSet<>(Arrays.asList(acceptingStates2));

        if (!acceptingStatesSet1.equals(acceptingStatesSet2)) {
            return false;
        }

        // 4. Comprobar si tienen las mismas transiciones
        Transition[] transitions1 = afd1.getTransitions();
        Transition[] transitions2 = afd2.getTransitions();

        Set<Transition> transitionSet1 = new HashSet<>(Arrays.asList(transitions1));
        Set<Transition> transitionSet2 = new HashSet<>(Arrays.asList(transitions2));

        if (!transitionSet1.equals(transitionSet2)) {
            return false;
        }

        // Si todas las comprobaciones pasaron, los AFDs son equivalentes
        return true;
    }
}