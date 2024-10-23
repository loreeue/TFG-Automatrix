package org.example.Services;

import automata.Automaton;
import automata.State;
import automata.fsa.Minimizer;
import grammar.Grammar;
import grammar.GrammarToAutomatonConverter;
import grammar.Production;
import grammar.reg.RegularGrammar;
import grammar.reg.RightLinearGrammarToFSAConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class GrammarService {

    @Autowired
    private AutomataService automataService;

    public GrammarService() {
    }

    public Grammar parseGrammar(Map<String, String> grammarMap) throws Exception {
        Grammar grammar = new RegularGrammar();

        for (String key : grammarMap.keySet()) {
            String productionStr = grammarMap.get(key);

            // Divide production into left side (lhs) and right side (rhs)
            String[] parts = productionStr.split("->");
            if (parts.length != 2) {
                throw new Exception("Formato de producción inválido: " + productionStr);
            }

            String lhs = parts[0].trim();  // Left
            String rhs = parts[1].trim();  // Right

            Production production = new Production(lhs, rhs);
            grammar.addProduction(production);
        }
        return grammar;
    }

    public boolean grammarsAreEquivalent(Grammar g1, Grammar g2) {
        try {
            // Convert regular grammars into finite automata
            GrammarToAutomatonConverter converter = new RightLinearGrammarToFSAConverter();
            Automaton automaton1 = converter.convertToAutomaton(g1);
            Automaton automaton2 = converter.convertToAutomaton(g2);

            // If there arent inicial state, we put it to the first node of the list
            if (automaton1.getInitialState() == null) {
                State initialState = automaton1.getStates()[0];
                automaton1.setInitialState(initialState);
            }
            if (automaton2.getInitialState() == null) {
                State initialState = automaton2.getStates()[0];
                automaton2.setInitialState(initialState);
            }

            // Minimize both automata
            Minimizer min = new Minimizer();
            Automaton minimizedAutomaton1 = min.getMinimizeableAutomaton(automaton1);
            Automaton minimizedAutomaton2 = min.getMinimizeableAutomaton(automaton2);

            // Compare whether minimized automata are equivalent
            return automataService.areEquivalent(minimizedAutomaton1, minimizedAutomaton2);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}