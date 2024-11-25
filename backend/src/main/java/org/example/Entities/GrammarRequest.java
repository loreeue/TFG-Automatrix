package org.example.Entities;

import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
public class GrammarRequest {
    private Map<String, String> grammar1;  // Map productions grammar1
    private Map<String, String> grammar2;  // Map productions grammar2

    public Map<String, String> getGrammar1() {
        return grammar1;
    }

    public Map<String, String> getGrammar2() {
        return grammar2;
    }
}