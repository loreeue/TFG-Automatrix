package org.example.Auxiliars;

import gui.action.OpenAction;
import java.util.*;
import org.w3c.dom.*;
import java.awt.Point;
import automata.Automaton;
import automata.Note;
import automata.State;
import automata.Transition;
import automata.graph.AutomatonGraph;
import automata.graph.LayoutAlgorithm;
import automata.graph.layout.GEMLayoutAlgorithm;
import automata.mealy.MooreMachine;
import automata.turing.TMTransition;
import automata.turing.TuringMachine;
import file.DataException;
import file.xml.CFPumpingLemmaTransducer;
import file.xml.FSATransducer;
import file.xml.GrammarTransducer;
import file.xml.LSystemTransducer;
import file.xml.MealyTransducer;
import file.xml.MooreTransducer;
import file.xml.PDATransducer;
import file.xml.RETransducer;
import file.xml.RegPumpingLemmaTransducer;
import file.xml.TMBBTransducer;

public class TMTransducerAux{
    private static final Map<String, Object> typeToTransducer;
    private static final Map<Class<?>, Object> classToTransducer;

    static {
        typeToTransducer = new HashMap<>();
        classToTransducer = new HashMap<>();
        add(null, automata.fsa.FiniteStateAutomaton.class, new FSATransducer());
        add(null, automata.pda.PushdownAutomaton.class, new PDATransducer());
        add(null, automata.turing.TuringMachine.class, new TMTransducerAux());
        add(null, automata.turing.TuringMachineBuildingBlocks.class, new TMBBTransducer());
        add(null, grammar.Grammar.class, new GrammarTransducer());
        add(null, regular.RegularExpression.class, new RETransducer());
        add(null, grammar.lsystem.LSystem.class, new LSystemTransducer());
        add(null, automata.mealy.MealyMachine.class, new MealyTransducer());
        add(null, automata.mealy.MooreMachine.class, new MooreTransducer());
        add(null, gui.pumping.RegPumpingLemmaChooser.class, new RegPumpingLemmaTransducer());
        add(null, gui.pumping.CFPumpingLemmaChooser.class, new CFPumpingLemmaTransducer());
    }

    public static TMTransducerAux getTransducer(Document document) {
        Element elem = document.getDocumentElement();
        NodeList typeNodes = elem.getElementsByTagName("type");
        NodeList bbNodes = elem.getElementsByTagName("block");
        NodeList multitapeNodes = elem.getElementsByTagName("tapes");

        if (multitapeNodes.getLength() > 0) {
            return instantiate(new TMTransducerAux());
        }

        if (bbNodes.getLength() > 0) {
            return instantiate(new TMBBTransducer());
        }
        if (typeNodes.getLength() == 0)
            throw new IllegalArgumentException(
                    "No <type> tag appears to exist!");

        Node typeElement = typeNodes.item(0);
        NodeList subtypeNodes = typeElement.getChildNodes();
        String type = "";

        for (int i = 0; i < subtypeNodes.getLength(); i++) {
            Node node = subtypeNodes.item(i);
            if (node.getNodeType() == Node.TEXT_NODE) {
                type = ((Text) node).getData();
                break;
            }
        }

        if (type.equals("turing")) {
            if (OpenAction.openOrRead) {
                return instantiate(new TMBBTransducer());
            }
			return instantiate(new TMTransducerAux());
        }
        Object o = typeToTransducer.get(type);
        if (o == null)
            throw new IllegalArgumentException("The type \"" + type
                    + "\" is not recognized.");
        return instantiate(o);
    }

    private static TMTransducerAux instantiate(Object object) {
        if (object instanceof Class) {
            try {
                return (TMTransducerAux) object.getClass().getDeclaredConstructor().newInstance();
            } catch (Throwable e) {
                throw new IllegalArgumentException("Could not instantiate "
                        + object + "!");
            }
        } else if (object instanceof TMTransducerAux) {
            return (TMTransducerAux) object;
        } else {
            throw new IllegalArgumentException("Object " + object
                    + " does not correspond to a transducer!");
        }
    }

    private static void add(String type, Class<?> structureClass, Object transducer) {
        typeToTransducer.put(type, transducer);
        classToTransducer.put(structureClass, transducer);
    }

	protected static Map<String, String> elementsToText(Node node) {
        NodeList children = node.getChildNodes();
        Map<String, String> e2t = new java.util.HashMap<>();
        for (int i = 0; i < children.getLength(); i++) {
            Node c = children.item(i);
            if (c.getNodeType() != Node.ELEMENT_NODE)
                continue;
            String elementName = ((Element) c).getTagName();
            String text = containedText(c);
            e2t.put(elementName, text);
        }
        return e2t;
    }

	protected Automaton createEmptyAutomaton(Document document) {
        Map<String, String> e2t = elementsToText(document.getDocumentElement());
        String s = e2t.get("tapes");
        if (s == null)
            s = "1";
        try {
            int tapes = Integer.parseInt(s);
            if (tapes < 1 || tapes > 5)
                throw new DataException(tapes
                        + " invalid # of tapes.  Valid # of tapes 1-5.");
            return new TuringMachine(tapes);
        } catch (NumberFormatException e) {
            throw new DataException("Error reading " + s
                    + " as number of tapes.");
        }
    }

	private void readnotes(Node parent, Automaton root, Document document) {
        NodeList allNodes = parent.getChildNodes();
        ArrayList<Node> noteNodes = new ArrayList<Node>();
        for (int k = 0; k < allNodes.getLength(); k++) {
            if (allNodes.item(k).getNodeName().equals("text")) {
                noteNodes.add(allNodes.item(k));
            }
        }
        for (int i = 0; i < noteNodes.size(); i++) {
            Node noteNode = noteNodes.get(i);
            if (noteNode.getNodeType() != Node.ELEMENT_NODE)
                continue;

            Map<String, String> e2t = elementsToText(noteNode);

            java.awt.Point p = new java.awt.Point();
            Object obj = (e2t).get("text");
            if (obj == null) continue;
            String textString = obj.toString();

            double x = 0, y = 0;
            try {
                x = Double.parseDouble(e2t.get("x"));
            } catch (NullPointerException e) {

            } catch (NumberFormatException e) {
                throw new DataException("The x coordinate "
                        + e2t.get("x")
                        + " could not be read for the note with text " + textString + ".");
            }
            try {
                y = Double.parseDouble(e2t.get("y"));
            } catch (NullPointerException e) {

            } catch (NumberFormatException e) {
                throw new DataException("The y coordinate "
                        + e2t.get("y")
                        + " could not be read for the note with text " + textString + ".");
            }
            p.setLocation(x, y);
            root.addNote(new Note(p, textString));
        }
    }

	protected static Integer parseID(String string) {
        try {
            int num = Integer.parseInt(string);
            Integer integer = Integer.valueOf(num);
            return integer;
        } catch (NumberFormatException e) {
            Integer integer = Integer.valueOf(-1);
            return integer;
        }
    }

	protected void createState(ArrayList<Node> stateNodes, Map<Integer, Node> i2sn,
                               Automaton automaton, Set<Object> locatedStates, Map<Integer, State> i2s, boolean isBlock,
                               Document document) {
        for (int i = 0; i < stateNodes.size(); i++) {
            Node stateNode = stateNodes.get(i);
            if (stateNode.getNodeType() != Node.ELEMENT_NODE)
                continue;
            String idString = ((Element) stateNode).getAttribute("id");
            if (idString == null)
                throw new DataException(
                        "State without id attribute encountered!");
            Integer id = parseID(idString);
            if (i2sn.put(id, stateNode) != null)
                throw new DataException("The state ID " + id
                        + " appears twice!");
        }
        Iterator<Integer> it = i2sn.keySet().iterator();
        while (it.hasNext()) {
            Integer id = it.next();
            Element stateNode = (Element) i2sn.get(id);
            Map<String, String> e2t = elementsToText(stateNode);
            java.awt.Point p = new java.awt.Point();
            boolean hasLocation = true;
            double x = 0, y = 0;
            try {
                x = Double.parseDouble(e2t.get("x"));
            } catch (NullPointerException e) {
                hasLocation = false;
            } catch (NumberFormatException e) {
                throw new DataException("The x coordinate "
                        + e2t.get("x")
                        + " could not be read for state " + id + ".");
            }
            try {
                y = Double.parseDouble(e2t.get("y"));
            } catch (NullPointerException e) {
                hasLocation = false;
            } catch (NumberFormatException e) {
                throw new DataException("The y coordinate "
                        + e2t.get("y")
                        + " could not be read for state " + id + ".");
            }
            p.setLocation(x, y);
            State state = null;
            if (!(automaton instanceof TuringMachine)) {
                state = automaton.createStateWithId(p, id.intValue());
            } else {
                Node tempNode = null;
                if (e2t.containsKey("tag")) {
                    String fileName = e2t.get("tag");
                    tempNode = document.getDocumentElement()
                            .getElementsByTagName(fileName).item(0);
                    Automaton temp = (TuringMachine) readAutomaton(tempNode, document);
                    state = ((TuringMachine) automaton).createInnerTM(p, temp, fileName,
                            id.intValue());
                } else {
                    state = ((TuringMachine) automaton).createTMStateWithID(p, id.intValue());
                }
            }
            if (hasLocation && locatedStates != null)
                locatedStates.add(state);
            i2s.put(id, state);
            String name = stateNode.getAttribute("name");
            if (name.equals("")) state.setName("q" + id.intValue());
            else state.setName(name);

            if (e2t.containsKey("name"))
                state.setName(e2t.get("name"));
            if (e2t.containsKey("label"))
                state.setLabel(e2t.get("label"));
            if (e2t.containsKey("final"))
                automaton.addFinalState(state);
            if (e2t.containsKey("initial"))
                automaton.setInitialState(state);
            if (automaton instanceof MooreMachine && e2t.containsKey(MooreTransducer.STATE_OUTPUT_NAME))
                ((MooreMachine) automaton).setOutput(state, e2t.get(MooreTransducer.STATE_OUTPUT_NAME));
        }
    }

	protected void addBlocks(Node node, Automaton automaton, Set<Object> locatedStates,
                             Map<Integer, State> i2s, Document document) {
        assert (automaton instanceof TuringMachine);
        if (node == null) return;
        if (!node.hasChildNodes())
            return;
        NodeList allNodes = node.getChildNodes();
        ArrayList<Node> blockNodes = new ArrayList<Node>();
        for (int k = 0; k < allNodes.getLength(); k++) {
            if (allNodes.item(k).getNodeName().equals("block")) {
                blockNodes.add(allNodes.item(k));
            }
        }
        Map<Integer, Node> i2sn = new java.util.TreeMap<Integer, Node>(new Comparator<Object>() {
            public int compare(Object o1, Object o2) {
                if (o1 instanceof Integer && !(o2 instanceof Integer))
                    return -1;
                if (o1 instanceof Integer)
                    return ((Integer) o1).intValue()
                            - ((Integer) o2).intValue();
                if (o2 instanceof Integer)
                    return 1;
                return ((Comparable) o1).compareTo(o2);
            }
        });
        createState(blockNodes, i2sn, automaton, locatedStates, i2s, true,
                document);
    }

	private void readBlocks(Node parent, Automaton root, Set<Object> states,
                            Document document) {
        Map<Integer, State> i2b = new java.util.HashMap<>();
        addBlocks(parent, root, states, i2b, document);
    }

	protected Map<Integer, State> readStates(Node node, Automaton automaton, Set<Object> locatedStates,
                                             Document document) {
        Map<Integer, State> i2s = new java.util.HashMap<Integer, State>();
        if (node == null) return i2s;
        NodeList allNodes = node.getChildNodes();
        ArrayList<Node> stateNodes = new ArrayList<Node>();
        for (int k = 0; k < allNodes.getLength(); k++) {
            if (allNodes.item(k).getNodeName().equals("state")) {
                stateNodes.add(allNodes.item(k));
            }
        }
        Map<Integer, Node> i2sn = new java.util.TreeMap<Integer, Node>(new Comparator<Object>() {
            public int compare(Object o1, Object o2) {
                if (o1 instanceof Integer && !(o2 instanceof Integer))
                    return -1;
                if (o1 instanceof Integer)
                    return ((Integer) o1).intValue()
                            - ((Integer) o2).intValue();
                if (o2 instanceof Integer)
                    return 1;
                return ((Comparable) o1).compareTo(o2);
            }
        });
        createState(stateNodes, i2sn, automaton, locatedStates, i2s, false,
                document);
        return i2s;
    }

	protected static String containedText(Node node) {
        NodeList children = node.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node c = children.item(i);
            if (c.getNodeType() != Node.TEXT_NODE)
                continue;
            return ((Text) c).getData();
        }
        return null;
    }

	protected Transition createTransition(State from, State to, Node node,
                                          Map<String, String> e2t, boolean isBlock) {
        TuringMachine tm = (TuringMachine) from.getAutomaton();
        int tapes = tm.tapes();
        String[] readStrings = new String[tapes], writeStrings = new String[tapes], moveStrings = new String[tapes];
        Arrays.fill(readStrings, "");
        Arrays.fill(writeStrings, "");
        Arrays.fill(moveStrings, "R");
        Map<String, String[]> tag2array = new HashMap<>();
        tag2array.put("read", readStrings);
        tag2array.put("write", writeStrings);
        tag2array.put("move", moveStrings);
        Iterator<String> it = tag2array.keySet().iterator();
        while (it.hasNext()) {
            String tag = it.next();
            String[] array = tag2array.get(tag);
            NodeList nodes = ((Element) node).getElementsByTagName(tag);
            for (int i = 0; i < nodes.getLength(); i++) {
                Element elem = (Element) nodes.item(i);
                String tapeString = elem.getAttribute("tape");
                if (tapeString.length() == 0)
                    tapeString = "1";
                int tape = 1;
                try {
                    tape = Integer.parseInt(tapeString);
                    if (tape < 1 || tape > tapes)
                        throw new DataException("In " + tag + " tag, tape "
                                + tape + " identified but only 1-" + tapes
                                + " are valid.");
                } catch (NumberFormatException e) {
                    throw new DataException("In " + tag
                            + " tag, error reading " + tapeString + " as tape.");
                }
                String contained = containedText(elem);
                if (contained == null)
                    contained = "";
                array[tape - 1] = contained;

                if (isBlock) {
                    for (int j = 0; j < writeStrings.length; j++) {
                        writeStrings[i] = "~";
                        moveStrings[i] = "S";
                    }
                }
            }
        }
        try {
            TMTransition t = new TMTransition(from, to, readStrings, writeStrings,
                    moveStrings);
            if (isBlock) t.setBlockTransition(true);
            return t;
        } catch (IllegalArgumentException e) {
            throw new DataException(e.getMessage());
        }
    }

	protected void readTransitions(Node parent, Automaton automaton,
                                   Map<Integer, State> map) {
        if (parent == null || automaton == null) return;
        NodeList allNodes = parent.getChildNodes();
        ArrayList<Node> tNodes = new ArrayList<Node>();
        boolean bool = false;
        for (int k = 0; k < allNodes.getLength(); k++) {
            if (allNodes.item(k).getNodeName().equals("transition")) {
                tNodes.add(allNodes.item(k));
            }
        }

        for (int i = 0; i < tNodes.size(); i++) {
            Node tNode = tNodes.get(i);
            Map<String, String> e2t = elementsToText(tNode);
            String isBlock = ((Element) tNode).getAttribute("block");
            if (isBlock.equals("true")) {
                bool = true;
            }
            String fromName = e2t.get("from");
            if (fromName == null)
                throw new DataException("A transition has no from state!");
            int id = parseID(fromName).intValue();
            State from = automaton.getStateWithID(id);
            if (from == null)
                throw new DataException("A transition is defined from "
                        + "non-existent state " + id + "!");
            String toName = e2t.get("to");
            if (toName == null)
                throw new DataException("A transition has no to state!");
            id = parseID(toName).intValue();
            State to = automaton.getStateWithID(id);
            if (to == null)
                throw new DataException("A transition is defined to "
                        + "non-existent state " + id + "!");
            Transition transition = createTransition(from, to, tNode, e2t, bool);
            automaton.addTransition(transition);
            bool = false;
            String controlX = e2t.get("controlx");
            String controlY = e2t.get("controly");
            if (controlX != null && controlY != null) {
                Point p = new Point(Integer.parseInt(controlX), Integer.parseInt(controlY));
                transition.setControl(p);
            } else {
                transition.setControl(null);
            }
        }
    }

	private void performLayout(Automaton automaton, Set<Object> locStates) {
        if (locStates.size() == automaton.getStates().length)
            return;
        AutomatonGraph graph = new AutomatonGraph(automaton);
        LayoutAlgorithm layout = new GEMLayoutAlgorithm();
        for (int i = 0; i < 3; i++)
            layout.layout(graph, locStates);
        if (locStates.size() < 2) {
            graph.moveWithinFrame(new java.awt.Rectangle(20, 20, 425, 260));
        }
        graph.moveAutomatonStates();
    }

	public java.io.Serializable readAutomaton(Node parent, Document document) {
        Set<Object> locatedStates = new java.util.HashSet<>();
		Map<String, Automaton> automatonMap = new java.util.HashMap<>();
        Automaton root = createEmptyAutomaton(document);
        if (parent == null) return root;
        readBlocks(parent, root, locatedStates, document);
        readTransitions(parent, root, readStates(parent, root, locatedStates,
                document));
        readnotes(parent, root, document);
        performLayout(root, locatedStates);
        automatonMap.put(parent.getNodeName(), root);
        return root;
    }

	public java.io.Serializable fromDOM(Document document) {
		Map<String, Automaton> automatonMap = new java.util.HashMap<>();
        automatonMap.clear();
        Node parent = document.getDocumentElement()
                .getElementsByTagName("automaton").item(0);
        if (parent == null) parent = document.getDocumentElement();
        return readAutomaton(parent, document);
    }
}
