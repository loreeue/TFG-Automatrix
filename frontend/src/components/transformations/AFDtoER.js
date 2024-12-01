import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const AFDToER = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setResult("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setResult("Por favor selecciona un archivo.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/convert/afd-to-er", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.startsWith("Error") || response.data.includes("no se puede convertir")) {
                setResult(response.data);
            } else {
                setResult(`Expresión Regular Generada: ${response.data}`);
            }
        } catch (error) {
            console.error("Error al convertir AFD a ER:", error);
            setResult("Error: No se pudo procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Convertir AFD a Expresión Regular
            </Typography>
            <form onSubmit={handleSubmit}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                >
                    Subir Archivo AFD (.jff)
                    <input
                        type="file"
                        hidden
                        accept=".jff"
                        onChange={handleFileChange}
                    />
                </Button>
                {file && (
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        Archivo seleccionado: {file.name}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir AFD a ER"}
                </Button>
            </form>
            {result && (
                <Typography
                    variant="h6"
                    color={result.startsWith("Error") || result.includes("no se puede convertir") ? "error" : "primary"}
                    sx={{ marginTop: 3 }}
                >
                    {result}
                </Typography>
            )}
        </Box>
    );
};

export default AFDToER;