package org.example.Auxiliars;

import automata.Automaton;
import automata.AutomatonSimulator;
import automata.Configuration;
import automata.Transition;
import automata.turing.AcceptByFinalStateFilter;
import automata.turing.AcceptanceFilter;
import automata.turing.TMConfiguration;
import automata.turing.TMState;
import automata.turing.TMTransition;
import automata.turing.Tape;
import automata.turing.TuringMachine;
import debug.EDebug;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import automata.*;

public class TMSimulator extends AutomatonSimulator {
    private final Map<String, String> varToChar = new HashMap<String, String>();
    private final AcceptanceFilter[] myFilters;
    private String[] inputStrings;

    public TMSimulator(Automaton automaton) {
        super(automaton);
        if (!(automaton instanceof TuringMachine))
            throw new IllegalArgumentException(
                    "Automaton is not a Turing machine, but a "
                            + automaton.getClass());
        List<AcceptanceFilter> tlist = new ArrayList<AcceptanceFilter>();

		tlist.add(new AcceptByFinalStateFilter());

        myFilters = tlist.toArray(new AcceptanceFilter[0]);
    }

    public Configuration[] getInitialConfigurations(String input) {
        int tapes = ((TuringMachine) myAutomaton).tapes();
        String[] inputs = new String[tapes];
        for (int i = 0; i < tapes; i++)
            inputs[i] = input;
        return getInitialConfigurations(inputs);
    }

    public Configuration[] getInitialConfigurations(String[] inputs) {
        inputStrings = (String[]) inputs.clone();
        Tape[] tapes = new Tape[inputs.length];
        for (int i = 0; i < tapes.length; i++)
            tapes[i] = new Tape(inputs[i]);
        Configuration[] configs = new Configuration[1];
        TMState initialState = (TMState) myAutomaton.getInitialState();
        configs[0] = new TMConfiguration(initialState, null, tapes, myFilters);


        return configs;
    }

    private boolean matches(Tape[] tapes, TMTransition tmt) {
        assert tapes.length == tmt.tapes();

        if (tapes.length > 1) {
            for (int i = 0; i < tapes.length; i++) {
                char underHead = tapes[i].readChar();
                char toMatch = tmt.getRead(i).charAt(0);

                if (underHead != toMatch && toMatch != '~')
                    return false;
            }
            return true;
        }

        assert tapes.length == 1;

        char underHead = tapes[0].readChar();
        String strtoMatch = tmt.getRead(0);

        int assignIndex = strtoMatch.indexOf('}');
        int bangIndex = strtoMatch.indexOf('!');

        assert assignIndex == -1 || bangIndex == -1;

        if (assignIndex == -1 && bangIndex == -1) {
            return underHead == strtoMatch.charAt(0) || strtoMatch.charAt(0) == '~';
        } else if (assignIndex != -1) {
            /*String[] characters = strtoMatch.substring(0, assignIndex).split(",");
            boolean flag = false;
            for (int i = 0; i < characters.length; i++) {
                assert characters[i].length() == 1;
                if (varToChar.containsKey(characters[i])) {
                    JOptionPane.showMessageDialog(null, "You cannot use a variable on the left side of the assignment operator!\n Please fix this and restart the simulation.",
                            "Illegal Variable Location!\n"
                            , JOptionPane.ERROR_MESSAGE);

                }
                if (characters[i].charAt(0) == underHead) flag = true;
            }
            if (flag) return flag;*/
        } else {
            assert bangIndex == 0;
            return underHead != strtoMatch.charAt(1);
        }

        assert false;
        return true;

    }

    public List<Configuration> stepBlock(TMConfiguration config) {
        EDebug.print("Inside StepBlock");
        while (((TuringMachine) (config = (TMConfiguration) stepConfiguration(config).get(0)).getCurrentState().getAutomaton()).getParent() != null)
            ;
        return Arrays.asList(config);
    }

    public ArrayList<Configuration> stepConfiguration(Configuration config) {
        ArrayList<Configuration> list = new ArrayList<>();
        TMConfiguration configuration = (TMConfiguration) config;


        TMState currentState = (TMState) configuration.getCurrentState();
        TuringMachine tmp = null;

        int times = 0;
        while ((tmp = currentState.getInnerTM()).getStates().length != 0) {
            EDebug.print(times++);
            currentState = (TMState) tmp.getInitialState();

            /*if (currentState == null) {
                JOptionPane.showMessageDialog(null, "It appears that one of your building blocks, possibly nested, lacks an initial state.\n " +
                                "Please resolve this problem and restart the simulation.",
                        "Missing Initial State"
                        , JOptionPane.ERROR_MESSAGE);

                return list;
            }*/
        }

        assert (tmp == currentState.getInnerTM());
        assert (tmp.getParent() == currentState);

        Transition[] trans = currentState.getAutomaton().getTransitionsFromState(currentState);
        TMTransition tmt = null;
        boolean success = false;
        outer:
        while (true) {
            Arrays.sort(trans, new Comparator<Transition>() {
                public int compare(Transition a, Transition b) {
                    TMTransition tma = (TMTransition) a;
                    TMTransition tmb = (TMTransition) b;

                    char fa = tma.getRead(0).charAt(0);
                    char fb = tmb.getRead(0).charAt(0);
                    return (fa == '!') ? (fb == '!' ? 0 : 1) : (fb == '!' ? 1 : 0);
                }
            });

            for (int i = 0; i < trans.length; i++) {
                tmt = (TMTransition) trans[i];

                if (matches(configuration.getTapes(), tmt)) {
                    success = true;
                    break outer;
                }
            }

            if (tmp.getParent() != null)
            {
                currentState = tmp.getParent();
                tmp = (TuringMachine) currentState.getAutomaton();
                trans = tmp.getTransitionsFromState(currentState);
            } else {
                break;
            }

        }


        if (success) {
            if (configuration.getTapes().length > 1) {
                for (int k = 0; k < configuration.getTapes().length; k++) {
                    configuration.getTapes()[k].writeChar(tmt.getWrite(k).charAt(0) == '~' ?
                            configuration.getTapes()[k].readChar() :
                            tmt.getWrite(k).charAt(0));
                    configuration.getTapes()[k].moveHead(tmt.getDirection(k));
                    list.add(new TMConfiguration(tmt.getToState(), null, configuration.getTapes(), myFilters));
                }
            } else {
                String st = tmt.getRead(0);
                int assignIndex = st.indexOf('}');

                if (assignIndex != -1) {
                    String s = "" + st.charAt(assignIndex + 1);
                    varToChar.put(s, configuration.getTapes()[0].readChar() + "");
                }

                configuration.getTapes()[0].writeChar(tmt.getWrite(0).charAt(0) == '~' ?
                        configuration.getTapes()[0].readChar() :
                        (varToChar.containsKey(tmt.getWrite(0).charAt(0) + "") ?
                                varToChar.get(tmt.getWrite(0).charAt(0) + "").charAt(0)
                                : tmt.getWrite(0).charAt(0)));

                configuration.getTapes()[0].moveHead(tmt.getDirection(0));
                list.add(new TMConfiguration(tmt.getToState(), null, configuration.getTapes(), myFilters));

            }
        } else {
            if (!configuration.isHalted()) {
                configuration.setHalted(true);
                list.add(configuration);
            }
        }
        return list;
    }

    public boolean isAccepted() {
        Iterator<Configuration> it = myConfigurations.iterator();
        while (it.hasNext()) {
            TMConfiguration configuration = (TMConfiguration) it.next();
            State currentState = configuration.getCurrentState();
            if (myAutomaton.isFinalState(currentState)) {
                return true;
            }
        }
        return false;
    }

    public boolean simulateInput(String input) {
        myConfigurations.clear();
        Configuration[] initialConfigs = getInitialConfigurations(input);
        for (int k = 0; k < initialConfigs.length; k++) {
            TMConfiguration initialConfiguration = (TMConfiguration) initialConfigs[k];
            myConfigurations.add(initialConfiguration);
        }
        while (!myConfigurations.isEmpty()) {
            if (isAccepted())
                return true;
            ArrayList<Configuration> configurationsToAdd = new ArrayList<>();
            Iterator<Configuration> it = myConfigurations.iterator();
            while (it.hasNext()) {
                TMConfiguration configuration = (TMConfiguration) it.next();
                ArrayList<Configuration> configsToAdd = stepConfiguration(configuration);
                configurationsToAdd.addAll(configsToAdd);
                it.remove();
            }
            myConfigurations.addAll(configurationsToAdd);
        }
        return false;
    }

    public String[] getInputStrings() {
        return inputStrings;
    }
}
