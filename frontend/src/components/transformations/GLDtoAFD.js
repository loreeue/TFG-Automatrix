import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, TextField, CircularProgress } from "@mui/material";

const GLDToAFD = () => {
    const [grammar, setGrammar] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!grammar) {
            setResult("Por favor, introduce la gramática.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/api/extra/gld-to-afd", { grammar });
            setResult(response.data);
        } catch (error) {
            console.error("Error al convertir GLD a AFD:", error);
            setResult("Error: No se pudo procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Convertir GLD a AFD
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Gramática Lineal"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={grammar}
                    onChange={(e) => setGrammar(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir GLD a AFD"}
                </Button>
            </form>
            {result && (
                <Typography
                    variant="h6"
                    color={result.startsWith("Error") ? "error" : "primary"}
                    sx={{ marginTop: 3 }}
                >
                    {result}
                </Typography>
            )}
        </Box>
    );
};

export default GLDToAFD;