package org.example.Entities;

import java.util.Map;

public class Grammar2Request {

    private Map<String, String> grammar;  // Map productions grammar1

    public Map<String, String> getGrammar() {
        return grammar;
    }

    public void setGrammar(Map<String, String> grammar) {
        this.grammar = grammar;
    }
}
