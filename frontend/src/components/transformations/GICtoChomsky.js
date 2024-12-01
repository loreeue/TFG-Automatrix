import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, CircularProgress, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const GICToChomsky = () => {
    const [grammar, setGrammar] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const exampleGrammar = `{\n\t"production1":"S -> aA",\n\t"production2":"A -> b"\n}`;

    const handleCopyExample = () => {
        navigator.clipboard.writeText(exampleGrammar);
        alert("Ejemplo copiado al portapapeles!");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!grammar) {
            alert("Por favor, introduce la gramática.");
            return;
        }

        setLoading(true);
        setResult(""); // Clear previous result

        try {
            const response = await axios.post("/api/convert/gic-to-chomsky", { grammar: JSON.parse(grammar) });

            // Display the result directly
            setResult(response.data);
        } catch (error) {
            console.error("Error al convertir GIC a Forma Normal de Chomsky:", error);
            setResult("Error: No se pudo procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Convertir GIC a Forma Normal de Chomsky
            </Typography>

            {/* Instructions and Example */}
            <Box
                sx={{
                    marginBottom: 3,
                    padding: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    width: "100%",
                    maxWidth: "600px",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Instrucciones:
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Introduzca la gramática en formato JSON, siguiendo el ejemplo:
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

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "600px" }}>
                <TextField
                    label="Gramática (GIC)"
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
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir GIC a Chomsky"}
                </Button>
            </form>

            {/* Display Result */}
            {result && (
                <Box
                    sx={{
                        marginTop: 3,
                        padding: 2,
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                        width: "100%",
                        maxWidth: "600px",
                        overflowX: "auto",
                        whiteSpace: "pre-wrap", // Preserve line breaks
                        fontFamily: "monospace", // Monospace font for readability
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Gramática en Forma Normal de Chomsky:
                    </Typography>
                    {result}
                </Box>
            )}
        </Box>
    );
};

export default GICToChomsky;