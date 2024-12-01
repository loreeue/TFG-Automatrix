import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, CircularProgress, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const GLDToAFD = () => {
    const [grammar, setGrammar] = useState("");
    const [loading, setLoading] = useState(false);

    const exampleGrammar = '{\n\t"production1":"S -> aA",\n\t"production2":"A -> b"\n}';

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

        try {
            const response = await axios.post("/api/convert/gld-to-afd", { grammar: JSON.parse(grammar) }, { responseType: "blob" });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "afd_from_gld.jff");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error al convertir GLD a AFD:", error);
            alert("Error: No se pudo procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                overflowY: "auto",
                padding: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Convertir GLD a AFD
            </Typography>
            {/* Instructions */}
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
                    Introduzca la gramática en formato JSON, con las producciones enumeradas como se muestra a
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

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Gramática Lineal Derecha"
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
        </Box>
    );
};

export default GLDToAFD;