import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Grammars from "./components/Grammars";
import AFDs from "./components/AFDs";
import Transformations from "./components/Transformations";
import Simulations from "./components/Simulations";
import SimulateAFD from "./components/simulations/SimulateAFD";
import SimulateAFND from "./components/simulations/SimulateAFND";
import SimulateAP from "./components/simulations/SimulateAP";
import SimulateMT from "./components/simulations/SimulateMT";
import EquivalentGrammars from "./components/grammars/EquivalentGrammars";
import EquivalentAFDs from "./components/afds/EquivalentAFDs";
import MinimizeAFD from "./components/afds/MinimizeAFD";
import AFDtoER from "./components/transformations/AFDtoER";
import AFNDtoAFD from "./components/transformations/AFNDtoAFD";
import APtoGIC from "./components/transformations/APtoGIC";
import GICtoAP from "./components/transformations/GICtoAP";
import GICtoChomsky from "./components/transformations/GICtoChomsky";
import GLDtoAFD from "./components/transformations/GLDtoAFD";
import DrawAutomataMenu from "./components/DrawAutomataMenu";
import DrawAFD from "./components/draw_automatas/DrawAFD";
import DrawAFND from "./components/draw_automatas/DrawAFND";
import DrawAP from "./components/draw_automatas/DrawAP";
import DrawMT from "./components/draw_automatas/DrawMT";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/gramaticas" element={<Grammars />} />
                <Route path="/afds" element={<AFDs />} />
                <Route path="/transformaciones" element={<Transformations />} />
                <Route path="/validaciones" element={<Simulations />} />
                <Route path="/simulate-afd" element={<SimulateAFD />} />
                <Route path="/simulate-afnd" element={<SimulateAFND />} />
                <Route path="/simulate-ap" element={<SimulateAP />} />
                <Route path="/simulate-mt" element={<SimulateMT />} />
                <Route path="/equivalent-grammars" element={<EquivalentGrammars />} />
                <Route path="/equivalent-afds" element={<EquivalentAFDs />} />
                <Route path="/minimize-afd" element={<MinimizeAFD />} />
                <Route path="/afd-to-er" element={<AFDtoER />} />
                <Route path="/afnd-to-afd" element={<AFNDtoAFD />} />
                <Route path="/ap-to-gic" element={<APtoGIC />} />
                <Route path="/gic-to-ap" element={<GICtoAP />} />
                <Route path="/gic-to-chomsky" element={<GICtoChomsky />} />
                <Route path="/gld-to-afd" element={<GLDtoAFD />} />
                <Route path="/draw_automata" element={<DrawAutomataMenu />} />
                <Route path="/draw_automata/afd" element={<DrawAFD />} />
                <Route path="/draw_automata/afnd" element={<DrawAFND />} />
                <Route path="/draw_automata/ap" element={<DrawAP />} />
                <Route path="/draw_automata/mt" element={<DrawMT />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;