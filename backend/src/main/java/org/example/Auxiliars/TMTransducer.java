package org.example.Auxiliars;

import gui.action.OpenAction;
import java.io.Serializable;
import java.util.*;
import org.w3c.dom.*;

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
import file.xml.Transducer;

public class TMTransducer{
    private static final Map<String, Object> typeToTransducer;
    private static final Map<Class<?>, Object> classToTransducer;

    static {
        typeToTransducer = new HashMap<>();
        classToTransducer = new HashMap<>();
        add(null, automata.fsa.FiniteStateAutomaton.class, new FSATransducer());
        add(null, automata.pda.PushdownAutomaton.class, new PDATransducer());
        add(null, automata.turing.TuringMachine.class, new TMTransducer());
        add(null, automata.turing.TuringMachineBuildingBlocks.class, new TMBBTransducer());
        add(null, grammar.Grammar.class, new GrammarTransducer());
        add(null, regular.RegularExpression.class, new RETransducer());
        add(null, grammar.lsystem.LSystem.class, new LSystemTransducer());
        add(null, automata.mealy.MealyMachine.class, new MealyTransducer());
        add(null, automata.mealy.MooreMachine.class, new MooreTransducer());
        add(null, gui.pumping.RegPumpingLemmaChooser.class, new RegPumpingLemmaTransducer());
        add(null, gui.pumping.CFPumpingLemmaChooser.class, new CFPumpingLemmaTransducer());
    }

    public static TMTransducer getTransducer(Document document) {
        Element elem = document.getDocumentElement();
        NodeList typeNodes = elem.getElementsByTagName("type");
        NodeList bbNodes = elem.getElementsByTagName("block");
        NodeList multitapeNodes = elem.getElementsByTagName("tapes");

        if (multitapeNodes.getLength() > 0) {
            return instantiate(new TMTransducer());
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
			return instantiate(new TMTransducer());
        }
        Object o = typeToTransducer.get(type);
        if (o == null)
            throw new IllegalArgumentException("The type \"" + type
                    + "\" is not recognized.");
        return instantiate(o);
    }

    public static TMTransducer getTransducer(Serializable structure) {
        Class<?> c = structure.getClass();
        while (c != null) {
            Object o = classToTransducer.get(c);
            if (o != null)
                return instantiate(o);
            c = c.getSuperclass();
        }
        throw new IllegalArgumentException(
                "Cannot get transducer for object of " + structure.getClass()
                        + "!");
    }

    private static TMTransducer instantiate(Object object) {
        if (object instanceof Class) {
            try {
                return (TMTransducer) object.getClass().getDeclaredConstructor().newInstance();
            } catch (Throwable e) {
                throw new IllegalArgumentException("Could not instantiate "
                        + object + "!");
            }
        } else if (object instanceof TMTransducer) {
            return (TMTransducer) object;
        } else {
            throw new IllegalArgumentException("Object " + object
                    + " does not correspond to a transducer!");
        }
    }

    private static void add(String type, Class<?> structureClass, Object transducer) {
        typeToTransducer.put(type, transducer);
        classToTransducer.put(structureClass, transducer);
    }
}
