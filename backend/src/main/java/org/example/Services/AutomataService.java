package org.example.Services;

import automata.fsa.FSAToRegularExpressionConverter;
import automata.fsa.FiniteStateAutomaton;
import automata.fsa.Minimizer;
import automata.fsa.NFAToDFA;
import automata.pda.PDATransition;
import automata.pda.PushdownAutomaton;
import automata.pda.PDAToCFGConverter;
import automata.turing.TMSimulator;
import automata.turing.TuringMachine;
import file.ParseException;
import file.XMLCodec;
import file.xml.Transducer;
import grammar.Grammar;
import grammar.GrammarToAutomatonConverter;
import grammar.Production;
import grammar.cfg.CFGToPDALLConverter;
import grammar.cfg.ContextFreeGrammar;
import grammar.reg.RightLinearGrammarToFSAConverter;

import org.example.Auxiliars.PDASimulatorEmpty;
import org.example.Auxiliars.PDASimulatorFinal;
import org.example.Auxiliars.TransducerFactory;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.*;
import org.w3c.dom.Document;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import automata.*;

@Service
public class AutomataService {

    public AutomataService() {
    }

    public FiniteStateAutomaton loadAFD(String filePath) {
        XMLCodec codec = new XMLCodec();
        FiniteStateAutomaton automaton = null;

        try {
            automaton = (FiniteStateAutomaton) codec.decode(new File(filePath), null);
        }
		catch (Exception e) {
            System.out.println("El AFD no se pudo cargar o es incorrecto");
            return null;
        }
        return automaton;
    }

    public boolean simulateAFD(FiniteStateAutomaton automaton, String input) throws Exception {
        AutomatonSimulator simulator = SimulatorFactory.getSimulator(automaton);
        if (simulator == null) throw new RuntimeException("Cannot load a simulator for this automaton.");
        return simulator.simulateInput(input);
    }

    public FiniteStateAutomaton loadAFND(String filePath) throws Exception {
        XMLCodec codec = new XMLCodec();
        FiniteStateAutomaton automaton = null;

        try {
            automaton = (FiniteStateAutomaton) codec.decode(new File(filePath), null);
        }
		catch (Exception e) {
            System.out.println("El AFND no se pudo cargar o es incorrecto");
            return null;
        }
        return automaton;
    }

    public boolean simulateAFND(FiniteStateAutomaton automaton, String input) throws Exception {
        AutomatonSimulator simulator = SimulatorFactory.getSimulator(automaton);
        if (simulator == null) throw new RuntimeException("Cannot load a simulator for this automaton.");
        return simulator.simulateInput(input);
    }

	public Serializable decodeTM(File file, Map<?, ?> parameters) {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		try {
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document doc = builder.parse(file);
			Transducer transducer = (Transducer) TransducerFactory.getTransducer(doc);
			return transducer.fromDOM(doc);
		} catch (ParserConfigurationException var7) {
			throw new ParseException("Java could not create the parser!");
		} catch (IOException var8) {
			throw new ParseException("Could not open file to read!");
		} catch (SAXException var9) {
			throw new ParseException("Could not parse XML!\n" + var9.getMessage());
		} catch (ExceptionInInitializerError var10) {
			System.err.println("STATIC INIT:");
			var10.getException().printStackTrace();
			throw new ParseException("Unexpected Error!");
		}
   }

    public TuringMachine loadTuringMachine(String filePath) throws Exception {
        TuringMachine automaton = null;

        try {
            automaton = (TuringMachine) decodeTM(new File(filePath), null);
        }
		/*catch (Exception e) {
            System.out.println("El TM no se pudo cargar o es incorrecto");
            return null;
        }*/
		catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Error cargando el fichero de MT: " + e.getMessage(), e);
		}
        return automaton;
    }

    public boolean simulateTuringMachine(TuringMachine automaton, String input) throws Exception {
		TMSimulator simulator = new TMSimulator(automaton);
		return simulator.simulateInput(input);
    }

    public PushdownAutomaton loadAP(String filePath) throws Exception {
        XMLCodec codec = new XMLCodec();
        PushdownAutomaton automaton = null;

        try {
            automaton = (PushdownAutomaton) codec.decode(new File(filePath), null);
        }
		catch (Exception e) {
            System.out.println("El AP no se pudo cargar o es incorrecto");
            return null;
        }
        return automaton;
    }

    public boolean simulateAPFinal(PushdownAutomaton automaton, String input) throws Exception {
        PDASimulatorFinal simulator = new PDASimulatorFinal(automaton);
		simulator.setAcceptByFinalState();
		return simulator.simulateInput(input);
    }

	public boolean simulateAPEmpty(PushdownAutomaton automaton, String input) throws Exception {
		PDASimulatorEmpty simulator = new PDASimulatorEmpty(automaton);
		simulator.setAcceptByEmptyStack();
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
        // 1. Check if they have the same number of states
        if (afd1.getStates().length != afd2.getStates().length) {
            return false;
        }

        // 2. Check if they have the same number of transitions
        if (afd1.getTransitions().length != afd2.getTransitions().length) {
            return false;
        }

        // 3. Check if they have the same states where it accepts
        State[] acceptingStates1 = afd1.getFinalStates();
        State[] acceptingStates2 = afd2.getFinalStates();

        if (acceptingStates1.length != acceptingStates2.length) {
            return false;
        }

        Set<State> acceptingStatesSet1 = new HashSet<>(Arrays.asList(acceptingStates1));
        Set<State> acceptingStatesSet2 = new HashSet<>(Arrays.asList(acceptingStates2));

        if (!stateEquals(acceptingStatesSet1, acceptingStatesSet2)) {
            return false;
        }

        // 4. Check if they have the same transitions
        Transition[] transitions1 = afd1.getTransitions();
        Transition[] transitions2 = afd2.getTransitions();

        Set<Transition> transitionSet1 = new HashSet<>(Arrays.asList(transitions1));
        Set<Transition> transitionSet2 = new HashSet<>(Arrays.asList(transitions2));

        if (!transitionEquals(transitionSet1, transitionSet2)) {
            return false;
        }
        return true;
    }

    public boolean areEquivalent(Automaton afd1, Automaton afd2) {
        // 1. Check if they have the same number of states
        if (afd1.getStates().length != afd2.getStates().length) {
            return false;
        }

        // 2. Check if they have the same number of transitions
        if (afd1.getTransitions().length != afd2.getTransitions().length) {
            return false;
        }

        // 3. Check if they have the same states where it accepts
        State[] acceptingStates1 = afd1.getFinalStates();
        State[] acceptingStates2 = afd2.getFinalStates();

        if (acceptingStates1.length != acceptingStates2.length) {
            return false;
        }

        Set<State> acceptingStatesSet1 = new HashSet<>(Arrays.asList(acceptingStates1));
        Set<State> acceptingStatesSet2 = new HashSet<>(Arrays.asList(acceptingStates2));

        if (!stateEquals(acceptingStatesSet1, acceptingStatesSet2)) {
            return false;
        }

        // 4. Check if they have the same transitions
        Transition[] transitions1 = afd1.getTransitions();
        Transition[] transitions2 = afd2.getTransitions();

        Set<Transition> transitionSet1 = new HashSet<>(Arrays.asList(transitions1));
        Set<Transition> transitionSet2 = new HashSet<>(Arrays.asList(transitions2));

        if (!transitionEquals(transitionSet1, transitionSet2)) {
            return false;
        }
        return true;
    }

    public boolean transitionEquals(Set<Transition> t1, Set<Transition> t2) {
        if (t1.size() != t2.size()) return false;

        for (Transition transition1 : t1) {
            boolean foundEqualState = false;
            for (Transition transition2 : t2) {
                if (transition1.getFromState().getID() == transition2.getFromState().getID() &&
                        transition1.getToState().getID() == transition2.getToState().getID()) {
                    foundEqualState = true;
                    break;
                }
            }
            if (!foundEqualState) {
                return false;
            }
        }
        return true;
    }

    public boolean stateEquals(Set<State> s1, Set<State> s2) {
        if (s1.size() != s2.size()) return false;

        for (State state1 : s1) {
            boolean foundEqualState = false;
            for (State state2 : s2) {
                if (state1.getID() == state2.getID() &&
                        Objects.equals(state1.getLabel(), state2.getLabel()) &&
                        Objects.equals(state1.getName(), state2.getName())) {
                    foundEqualState = true;
                    break;
                }
            }
            if (!foundEqualState) {
                return false;
            }
        }
        return true;
    }

    public String convertAPToGIC(PushdownAutomaton automaton) {
        PDAToCFGConverter converter = new PDAToCFGConverter();
        ContextFreeGrammar cfg = converter.convertToContextFreeGrammar(automaton);
        return cfg.toString();
    }

    public void saveAP(Automaton ap, String filePath) {
        XMLCodec codec = new XMLCodec();
        codec.encode(ap, new File(filePath), new HashMap<>());
    }

    // Other version of GrammarToAutomatonConverter -> convertToAutomaton. For AP
    public Automaton convertToAutomaton(Grammar grammar) {
        GrammarToAutomatonConverter converter = new CFGToPDALLConverter();
        ArrayList<Transition> list = new ArrayList<>();

        PushdownAutomaton automaton = new PushdownAutomaton();
        converter.createStatesForConversion(grammar, automaton);
        Production[] productions = grammar.getProductions();

        for (Production production : productions) {
            PDATransition transition = (PDATransition) converter.getTransitionForProduction(production);
            list.add(transition);
        }

        for (Transition transition : list) {
            automaton.addTransition(transition);
        }

        return automaton;
    }

    public String convertAFDToER(FiniteStateAutomaton afd) {
        String er = FSAToRegularExpressionConverter.convertToRegularExpression(afd);
        return er;
    }

    public FiniteStateAutomaton convertGLDToAFD(Grammar grammar) {
        FiniteStateAutomaton automaton = new FiniteStateAutomaton();
        RightLinearGrammarToFSAConverter converter = new RightLinearGrammarToFSAConverter();

        converter.createStatesForConversion(grammar, automaton);
        for (Production production : grammar.getProductions()) {
            Transition transition = converter.getTransitionForProduction(production);
            if (transition != null) {
                automaton.addTransition(transition);
            }
        }
        return automaton;
    }
}
