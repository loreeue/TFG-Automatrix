package org.example.Services;

import automata.State;
import automata.fsa.FSATransition;
import automata.fsa.FiniteStateAutomaton;
import file.xml.GrammarTransducer;
import grammar.Grammar;
import grammar.Production;
import grammar.reg.RegularGrammar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;

import org.xml.sax.InputSource;

@Service
public class GrammarService {

    @Autowired
    private AutomataService automataService;

    public GrammarService() {
    }

    public RegularGrammar parseGrammar(String grammarString) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        InputSource inputSource = new InputSource(new StringReader(grammarString));
        Document document = builder.parse(inputSource);

        GrammarTransducer transducer = new GrammarTransducer();
        return (RegularGrammar) transducer.fromDOM(document); // Error
    }

    public boolean grammarsAreEquivalent(Grammar g1, Grammar g2) { // Solo para gramáticas regulares
        if (!(g1 instanceof RegularGrammar && g2 instanceof RegularGrammar)) {
            throw new IllegalArgumentException("Las gramáticas deben ser regulares para comprobar equivalencia.");
        }

        try {
            // Convert regular grammars into finite automata
            FiniteStateAutomaton automaton1 = convertGrammarToAutomaton((RegularGrammar) g1);
            FiniteStateAutomaton automaton2 = convertGrammarToAutomaton((RegularGrammar) g2);

            // Minimize both automata
            FiniteStateAutomaton minimizedAutomaton1 = automataService.minimize(automaton1);
            FiniteStateAutomaton minimizedAutomaton2 = automataService.minimize(automaton2);

            // Compare whether minimized automata are equivalent
            return automataService.areEquivalent(minimizedAutomaton1, minimizedAutomaton2);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private FiniteStateAutomaton convertGrammarToAutomaton(RegularGrammar grammar) {
        FiniteStateAutomaton automaton = new FiniteStateAutomaton();

        // Create the states corresponding to the grammar variables
        String[] variables = grammar.getVariables();
        for (String variable : variables) {
            State state = automaton.createState(new java.awt.Point(0, 0));
            automaton.addState(state);
            state.setLabel(variable);
        }

        // Get the initial state of the automaton
        State initialState = automaton.getStates()[0];  // Suposición: el primer estado es el inicial
        automaton.setInitialState(initialState);

        // Create transitions from productions
        for (Production production : grammar.getProductions()) {
            String lhs = production.getLHS();
            String rhs = production.getRHS();

            // Get the status
            State fromState = getStateByLabel(automaton, lhs);

            if (rhs.length() == 1) {
                // If the production is of type A -> a
                String symbol = rhs;
                State finalState = automaton.createState(new java.awt.Point(0, 0));  // Final state
                automaton.addState(finalState);
                automaton.addFinalState(finalState);
                FSATransition transition = new FSATransition(fromState, finalState, symbol);
                automaton.addTransition(transition);
            }
            else if (rhs.length() == 2) {
                // If the production is of type A -> aB
                String symbol = String.valueOf(rhs.charAt(0));  // The symbol of transition
                String nextVariable = String.valueOf(rhs.charAt(1));  // The next state is B
                State toState = getStateByLabel(automaton, nextVariable);
                FSATransition transition = new FSATransition(fromState, toState, symbol);
                automaton.addTransition(transition);
            }
        }

        return automaton;
    }

    private State getStateByLabel(FiniteStateAutomaton automaton, String label) {
        for (State state : automaton.getStates()) {
            if (label.equals(state.getLabel())) {
                return state;
            }
        }
        return null;
    }
}