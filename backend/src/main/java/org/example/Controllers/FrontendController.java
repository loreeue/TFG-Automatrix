package org.example.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {
    @RequestMapping(value = { "/", "/{path:^(?!.*\\.).*$}", "/**/{path:^(?!.*\\.).*$}" })
    public String forward() {
        // Retorna index.html para que React Router gestione la ruta
        return "forward:/index.html";
    }
}
