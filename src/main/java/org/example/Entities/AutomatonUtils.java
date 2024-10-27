package org.example.Entities;
import automata.fsa.FiniteStateAutomaton;
import automata.State;
import automata.Transition;
import automata.fsa.FSATransition;

public class AutomatonUtils {

    public static void ensureCompleteTransitions(FiniteStateAutomaton automaton) {
        State[] states = automaton.getStates();

        // Loop through each pair of states to check for transitions
        for (State fromState : states) {
            for (State toState : states) {
                Transition[] transitions = automaton.getTransitionsFromStateToState(fromState, toState);

                // If there are no transitions between fromState and toState, add one of "ø"
                if (transitions.length == 0) {
                    FSATransition emptyTransition = new FSATransition(fromState, toState, "ø");
                    automaton.addTransition(emptyTransition);
                }
            }
        }
    }
}