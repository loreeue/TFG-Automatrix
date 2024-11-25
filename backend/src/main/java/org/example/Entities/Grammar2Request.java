package org.example.Entities;

import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
public class Grammar2Request {
    private Map<String, String> grammar;  // Map productions grammar1

    public Map<String, String> getGrammar() {
        return grammar;
    }
}
