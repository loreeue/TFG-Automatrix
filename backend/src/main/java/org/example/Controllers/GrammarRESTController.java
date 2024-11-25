package org.example.Controllers;

import org.example.Services.GrammarService;
import org.example.Entities.GrammarRequest;
import grammar.Grammar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/grammar")
public class GrammarRESTController {

    @Autowired
    private GrammarService grammarService;

    @PostMapping("/equivalent")
    public boolean areGrammarsEquivalent(@RequestBody GrammarRequest request) {
        try {
            Grammar grammar1 = grammarService.parseGrammar(request.getGrammar1());
            Grammar grammar2 = grammarService.parseGrammar(request.getGrammar2());

            // Compare the grammars
            return grammarService.grammarsAreEquivalent(grammar1, grammar2);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
