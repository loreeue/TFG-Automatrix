import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, CircularProgress, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const EquivalentGrammars = () => {
    const [grammar1, setGrammar1] = useState("");
    const [grammar2, setGrammar2] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const exampleGrammar = '{\n\t"production1":"S -> aA",\n\t"production2":"A -> b"\n}';

    const handleCopyExample = () => {
        navigator.clipboard.writeText(exampleGrammar);
        alert("Ejemplo copiado al portapapeles!");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const parsedGrammar1 = JSON.parse(grammar1.trim());
            const parsedGrammar2 = JSON.parse(grammar2.trim());

            const response = await axios.post("/api/grammar/equivalent", {
                grammar1: parsedGrammar1,
                grammar2: parsedGrammar2,
            });
            setResult(response.data ? "Las gramáticas son equivalentes." : "Las gramáticas no son equivalentes.");
        } catch (error) {
            console.error("Error verificando equivalencia:", error);
            setResult("Formato de gramática inválido o error en el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh", // Contenedor ocupa toda la ventana
                overflowY: "auto", // Scroll vertical
                padding: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Verificar Equivalencia de Gramáticas
            </Typography>
            {/* Explicación */}
            <Box
                sx={{
                    marginBottom: 3,
                    padding: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Instrucciones:
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Introduzca cada gramática en formato JSON, con sus producciones enumeradas como se muestra a
                    continuación:
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#e0e0e0",
                        padding: 2,
                        borderRadius: "8px",
                        fontFamily: "monospace",
                    }}
                >
                    <Box sx={{ flex: 1 }}>{exampleGrammar}</Box>
                    <IconButton
                        onClick={handleCopyExample}
                        sx={{
                            marginLeft: 1,
                            backgroundColor: "#d6d6d6",
                            "&:hover": {
                                backgroundColor: "#cfcfcf",
                            },
                        }}
                    >
                        <ContentCopyIcon />
                    </IconButton>
                </Box>
            </Box>

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