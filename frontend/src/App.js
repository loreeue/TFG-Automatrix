import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Grammars from "./components/Grammars";
import AFDs from "./components/AFDs";
import Transformations from "./components/Transformations";
import Simulations from "./components/Simulations";
import SimulateAFD from "./components/SimulateAFD";
import SimulateAFND from "./components/SimulateAFND";
import SimulateAP from "./components/SimulateAP";
import SimulateMT from "./components/SimulateMT";

const App = () => {
    return (
        <Router>
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
            </Routes>
        </Router>
    );
};

export default App;