package org.example.Services;

import automata.Automaton;
import automata.State;
import automata.fsa.Minimizer;
import grammar.Grammar;
import grammar.GrammarToAutomatonConverter;
import grammar.Production;
import grammar.reg.RegularGrammar;
import grammar.reg.RightLinearGrammarToFSAConverter;
import gui.environment.GrammarEnvironment;
import gui.grammar.GrammarInputPane;
import gui.grammar.transform.ChomskyPane;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class GrammarService {

    @Autowired
    private AutomataService automataService;

    public GrammarService() {
    }

    public Grammar parseGrammar(Map<String, String> grammarMap) {
        Grammar grammar = new RegularGrammar();

        for (String key : grammarMap.keySet()) {
            String productionStr = grammarMap.get(key);

            // Dividir producción en lado izquierdo (lhs) y lado derecho (rhs)
            String[] parts = productionStr.split("->");
            if (parts.length != 2) {
                System.out.println("Formato de producción inválido");
                return grammar;
            }

            String lhs = parts[0].trim();  // Lado izquierdo
            String rhs = parts[1].trim();  // Lado derecho

            Production production = new Production(lhs, rhs);
            grammar.addProduction(production);
        }

        // Asignar variable inicial si hay variables en la gramática
        if (grammar.getVariables().length > 0) {
            grammar.setStartVariable(grammar.getVariables()[0]);
        } else {
            System.out.println("No se pudo establecer variable inicial, no hay variables válidas.");
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

    public String transformToChomsky(Grammar grammar) {
        GrammarInputPane inputPane = new GrammarInputPane(new RegularGrammar());
        GrammarEnvironment environment = new GrammarEnvironment(inputPane);
        ChomskyPane chomskyPane = new ChomskyPane(environment, grammar);

        // Obtain new grammar
        Grammar cnfGrammar = chomskyPane.getGrammar();
        return cnfGrammar.toString();
    }
}