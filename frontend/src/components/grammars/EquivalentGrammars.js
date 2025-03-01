import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    IconButton,
    Grid,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EquivalentGrammars = () => {
    const [grammar1, setGrammar1] = useState("");
    const [grammar2, setGrammar2] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const exampleGrammar = '{\n\t"production1":"S -> aA",\n\t"production2":"A -> b"\n}';

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

        if (!grammar1.trim() || !grammar2.trim()) {
            toast.error("Por favor, introduce ambas gramáticas antes de verificar.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        let parsedGrammar1, parsedGrammar2;

        try {
            parsedGrammar1 = JSON.parse(grammar1.trim());
            parsedGrammar2 = JSON.parse(grammar2.trim());
        } catch (error) {
            toast.error("Error en el formato de la gramática. Asegúrate de seguir el ejemplo.", {
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

        try {
            const response = await axios.post("/api/grammar/equivalent", {
                grammar1: parsedGrammar1,
                grammar2: parsedGrammar2,
            });

            setResult(
                response.data
                    ? "Las gramáticas son equivalentes."
                    : "Las gramáticas no son equivalentes."
            );
        } catch (error) {
            console.error("Error verificando equivalencia:", error);
            toast.error("Error en el servidor al verificar la equivalencia.", {
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

    const handlePaste = (event, setGrammar) => {
        event.preventDefault();
        const pastedText = (event.clipboardData || window.clipboardData).getData("text");
        setGrammar(pastedText);
    };

    return (
        <Box
            sx={{
                minHeight: "75vh",
                backgroundColor: "#1A1A1A",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#FFFFFF",
            }}
        >
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
                Verificar Equivalencia de Gramáticas
            </Typography>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: "800px",
                    marginBottom: 2,
                    padding: 2,
                    borderRadius: "12px",
                    backgroundColor: "#2C2C2C",
                }}
            >
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                    Instrucciones:
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                    Introduzca cada gramática en formato JSON, con sus producciones enumeradas como se muestra a continuación:
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#333333",
                        padding: 2,
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontFamily: "'Josefin Sans', sans-serif",
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
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Spicy Rice', cursive",
                                textAlign: "center",
                                marginBottom: 1,
                                color: "#FFFFFF",
                            }}
                        >
                            Gramática 1
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={grammar1}
                            onChange={(e) => setGrammar1(e.target.value)}
                            onPaste={(e) => handlePaste(e, setGrammar1)}
                            sx={{
                                backgroundColor: "#2C2C2C",
                                borderRadius: "8px",
                                "& .MuiInputBase-input": {
                                    color: "#FFFFFF",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                },
                            }}
                            InputProps={{
                                style: { color: "#FFFFFF" },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Spicy Rice', cursive",
                                textAlign: "center",
                                marginBottom: 1,
                                color: "#FFFFFF",
                            }}
                        >
                            Gramática 2
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={grammar2}
                            onChange={(e) => setGrammar2(e.target.value)}
                            onPaste={(e) => handlePaste(e, setGrammar2)}
                            sx={{
                                backgroundColor: "#2C2C2C",
                                borderRadius: "8px",
                                "& .MuiInputBase-input": {
                                    color: "#FFFFFF",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                },
                            }}
                            InputProps={{
                                style: { color: "#FFFFFF" },
                            }}
                        />
                    </Grid>
                </Grid>
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
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verificar"}
                </Button>
            </form>

            {result && (
                <Typography
                    variant="h6"
                    sx={{
                        marginTop: 3,
                        textAlign: "center",
                        color: "#FFFFFF",
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {result}
                </Typography>
            )}
        </Box>
    );
};

export default EquivalentGrammars;
