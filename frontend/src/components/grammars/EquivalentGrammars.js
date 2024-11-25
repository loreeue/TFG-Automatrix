import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";

const EquivalentGrammars = () => {
    const [grammar1, setGrammar1] = useState("");
    const [grammar2, setGrammar2] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true); // Activa el indicador de carga

        try {
            const response = await axios.post("/api/grammar/equivalent", {
                grammar1,
                grammar2,
            });
            setResult(response.data ? "Las gramáticas son equivalentes." : "Las gramáticas no son equivalentes.");
        } catch (error) {
            console.error("Error verificando equivalencia:", error);
            setResult("Ocurrió un error al verificar las gramáticas.");
        } finally {
            setLoading(false); // Desactiva el indicador de carga
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Verificar Equivalencia de Gramáticas
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Gramática 1"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={grammar1}
                    onChange={(e) => setGrammar1(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Gramática 2"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={grammar2}
                    onChange={(e) => setGrammar2(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verificar"}
                </Button>
            </form>
            {result && (
                <Typography
                    variant="h6"
                    color={result.includes("error") ? "error" : "primary"}
                    sx={{ marginTop: 3 }}
                >
                    {result}
                </Typography>
            )}
        </Box>
    );
};

export default EquivalentGrammars;