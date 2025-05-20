package org.example.Auxiliars;

import automata.Automaton;
import automata.AutomatonSimulator;
import automata.Configuration;
import automata.State;
import automata.Transition;
import automata.pda.CharacterStack;
import automata.pda.PDAConfiguration;
import automata.pda.PDATransition;
import java.util.ArrayList;
import java.util.Iterator;

public class PDASimulatorFinal extends AutomatonSimulator {

    protected static final int EMPTY_STACK = 0;
    protected static final int FINAL_STATE = 1;
    protected int myAcceptance;

    public PDASimulatorFinal(Automaton automaton) {
        super(automaton);

		myAcceptance = FINAL_STATE;
    }

    public Configuration[] getInitialConfigurations(String input) {
        Configuration[] configs = new Configuration[1];
        CharacterStack stack = new CharacterStack();
        stack.push("Z");
        configs[0] = new PDAConfiguration(myAutomaton.getInitialState(), null, input, input, stack, myAcceptance);
        return configs;
    }

    public ArrayList<Configuration> stepConfiguration(Configuration config) {
        ArrayList<Configuration> list = new ArrayList<Configuration>();
        PDAConfiguration configuration = (PDAConfiguration) config;
        String unprocessedInput = configuration.getUnprocessedInput();
        String totalInput = configuration.getInput();
        State currentState = configuration.getCurrentState();
        Transition[] transitions = myAutomaton
                .getTransitionsFromState(currentState);
        for (int k = 0; k < transitions.length; k++) {
            PDATransition transition = (PDATransition) transitions[k];
            String inputToRead = transition.getInputToRead();
            String stringToPop = transition.getStringToPop();
            CharacterStack tempStack = configuration.getStack();
            CharacterStack stack = new CharacterStack(tempStack);
            String stackContents = stack.pop(stringToPop.length());
            if (unprocessedInput.startsWith(inputToRead)
                    && stringToPop.equals(stackContents)) {
                String input = "";
                if (inputToRead.length() < unprocessedInput.length()) {
                    input = unprocessedInput.substring(inputToRead.length());
                }
                State toState = transition.getToState();
                stack.push(transition.getStringToPush());
                PDAConfiguration configurationToAdd = new PDAConfiguration(
                        toState, configuration, totalInput, input, stack, myAcceptance);
                list.add(configurationToAdd);
            }
        }

        return list;
    }

    public void setAcceptByFinalState() {
        myAcceptance = FINAL_STATE;
    }

    public void setAcceptByEmptyStack() {
        myAcceptance = EMPTY_STACK;
    }

    public boolean isAccepted() {
        Iterator<Configuration> it = myConfigurations.iterator();
        while (it.hasNext()) {
            PDAConfiguration configuration = (PDAConfiguration) it.next();
            if (myAcceptance == FINAL_STATE) {
                State currentState = configuration.getCurrentState();
                if (configuration.getUnprocessedInput() == ""
                        && myAutomaton.isFinalState(currentState)) {
                    return true;
                }
            } else if (myAcceptance == EMPTY_STACK) {
                CharacterStack stack = configuration.getStack();
                if (configuration.getUnprocessedInput() == ""
                        && stack.height() == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean simulateInput(String input) {
        myConfigurations.clear();
        Configuration[] initialConfigs = getInitialConfigurations(input);
        for (int k = 0; k < initialConfigs.length; k++) {
            PDAConfiguration initialConfiguration = (PDAConfiguration) initialConfigs[k];
            myConfigurations.add(initialConfiguration);
        }
        int count = 0;
        while (!myConfigurations.isEmpty()) {
            if (isAccepted())
                return true;
            ArrayList<Configuration> configurationsToAdd = new ArrayList<Configuration>();
            Iterator<Configuration> it = myConfigurations.iterator();
            while (it.hasNext()) {
                PDAConfiguration configuration = (PDAConfiguration) it.next();
                ArrayList<Configuration> configsToAdd = stepConfiguration(configuration);
                configurationsToAdd.addAll(configsToAdd);
                it.remove();
                count++;
            }
            myConfigurations.addAll(configurationsToAdd);
        }
        return false;
    }
}
