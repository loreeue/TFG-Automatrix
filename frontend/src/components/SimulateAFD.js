import React, { useState } from "react";
import axios from "axios";

const SimulateAFD = () => {
    const [file, setFile] = useState(null);
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("Archivo seleccionado:", file);
        console.log("Cadena de entrada:", input);

        if (!file) {
            setResult("Por favor selecciona un archivo.");
            return;
        }
        if (!input) {
            setResult("Por favor ingresa una cadena de entrada.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("input", input);

        try {
            const response = await axios.post(
                "/api/validate/afd",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResult("Error: " + error.message);
        }
    };

    return (
        <div>
            <h1>Simular AFD</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Archivo del AFD (.jff):
                    <input type="file" onChange={handleFileChange} accept=".jff" />
                </label>
                <br />
                <label>
                    Cadena de entrada:
                    <input type="text" value={input} onChange={handleInputChange} />
                </label>
                <br />
                <button type="submit">Simular</button>
            </form>
            {result && <div>Resultado: {result}</div>}
        </div>
    );
};

export default SimulateAFD;