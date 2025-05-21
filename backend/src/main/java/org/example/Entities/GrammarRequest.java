package org.example.Entities;

import java.util.Map;

public class GrammarRequest {

    private Map<String, String> grammar1;  // Map productions grammar1
    private Map<String, String> grammar2;  // Map productions grammar2

    public Map<String, String> getGrammar1() {
        return grammar1;
    }

    public void setGrammar1(Map<String, String> grammar1) {
        this.grammar1 = grammar1;
    }

    public Map<String, String> getGrammar2() {
        return grammar2;
    }

    public void setGrammar2(Map<String, String> grammar2) {
        this.grammar2 = grammar2;
    }
}
