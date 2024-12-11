import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GICToChomsky = () => {
    const [grammar, setGrammar] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const exampleGrammar = `{\n\t"production1":"S -> aA",\n\t"production2":"A -> b"\n}`;

    const handleCopyExample = () => {
        navigator.clipboard.writeText(exampleGrammar);
        toast.success("Ejemplo copiado al portapapeles!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!grammar) {
            toast.error("Por favor, introduce la gramática.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        setLoading(true);
        setResult("");

        try {
            const response = await axios.post("/api/convert/gic-to-chomsky", {
                grammar: JSON.parse(grammar),
            });

            setResult(response.data);
        } catch (error) {
            console.error("Error al convertir GIC a Forma Normal de Chomsky:", error);
            toast.error("Error: No se pudo procesar la solicitud.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "120vh", // Aumentamos la altura del contenedor principal
                backgroundColor: "#1A1A1A",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#FFFFFF",
            }}
        >
            {/* Toast Container */}
            <ToastContainer />

            <Typography
                variant="h3"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 3,
                    fontFamily: "'Spicy Rice', cursive",
                }}
            >
                Convertir GIC a Forma Normal de Chomsky
            </Typography>

            {/* Example Section */}
            <Box
                sx={{
                    marginBottom: 3,
                    padding: 3,
                    borderRadius: "8px",
                    backgroundColor: "#2C2C2C",
                    width: "100%",
                    maxWidth: "800px",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Instrucciones:
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Introduzca la gramática en formato JSON, siguiendo este ejemplo:
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#333333",
                        padding: 2,
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        color: "#FFFFFF",
                    }}
                >
                    <Box sx={{ flex: 1 }}>{exampleGrammar}</Box>
                    <IconButton
                        onClick={handleCopyExample}
                        sx={{
                            marginLeft: 1,
                            backgroundColor: "#444444",
                            color: "#FFFFFF",
                            "&:hover": {
                                backgroundColor: "#555555",
                            },
                        }}
                    >
                        <ContentCopyIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Spicy Rice', cursive",
                        textAlign: "center",
                        marginBottom: 1,
                    }}
                >
                    Gramática
                </Typography>
                <TextField
                    label=""
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={6}
                    value={grammar}
                    onChange={(e) => setGrammar(e.target.value)}
                    sx={{
                        backgroundColor: "#2C2C2C",
                        borderRadius: "8px",
                        input: { color: "#FFFFFF" },
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                        marginTop: 3,
                        padding: "1rem",
                        borderRadius: "8px",
                        backgroundColor: "#694D75",
                        "&:hover": {
                            backgroundColor: "#331832",
                        },
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                        "Convertir GIC a Chomsky"
                    )}
                </Button>
            </form>

            {result && (
                <Box
                    sx={{
                        marginTop: 3,
                        padding: 2,
                        border: "1px solid #444444",
                        borderRadius: "8px",
                        backgroundColor: "#2C2C2C",
                        width: "100%",
                        maxWidth: "800px",
                        minHeight: "300px", // Aumentamos el tamaño mínimo para el contenido
                        maxHeight: "600px", // Limitar la altura máxima para mejor control
                        overflowY: "auto", // Permitir desplazamiento
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        color: "#FFFFFF",
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