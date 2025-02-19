import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const APToGIC = () => {
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
            toast.error("Por favor selecciona un archivo AP (.jff).", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        if (!file.name.endsWith(".jff")) {
            toast.error("El archivo seleccionado no es un AP válido (.jff).", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Leer el archivo y verificar que sea un AP
        const readFileContent = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;

                    // Verificar si tiene la estructura de un autómata y es un AP
                    if (!content.includes("<structure>") || !content.includes("<type>pda</type>") || !content.includes("<automaton>")) {
                        resolve(false);
                        return;
                    }

                    resolve(true); // Si cumple con los requisitos, es un AP
                };
                reader.onerror = () => reject(false);
                reader.readAsText(file);
            });
        };

        const isValidAP = await readFileContent(file);

        if (!isValidAP) {
            toast.error("El archivo seleccionado no es un AP válido. Por favor sube un archivo correcto.", {
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

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/convert/ap-to-gic", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setResult(response.data);
        } catch (error) {
            console.error("Error al convertir AP a GIC:", error);
            toast.error("Error en el servidor al procesar la conversión.", {
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
                Convertir AP a GIC
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{
                        marginBottom: 2,
                        padding: "1rem",
                        borderRadius: "8px",
                        backgroundColor: "#694D75",
                        "&:hover": { backgroundColor: "#331832" },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Subir Archivo AP (.jff)
                    <input
                        type="file"
                        hidden
                        accept=".jff"
                        onChange={handleFileChange}
                    />
                </Button>

                {file && (
                    <Typography
                        variant="body2"
                        sx={{
                            marginBottom: 2,
                            textAlign: "center",
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                    >
                        Archivo seleccionado: {file.name}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                        padding: "1rem",
                        borderRadius: "8px",
                        backgroundColor: "#694D75",
                        "&:hover": { backgroundColor: "#331832" },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir AP a GIC"}
                </Button>
            </form>

            {result && (
                <Box
                    sx={{
                        marginTop: 3,
                        padding: 2,
                        borderRadius: "8px",
                        backgroundColor: "#2C2C2C",
                        width: "100%",
                        maxWidth: "800px",
                        color: "#FFFFFF",
                        fontFamily: "monospace",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            marginBottom: 1,
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                    >
                        Gramática Independiente de Contexto:
                    </Typography>
                    {result}
                </Box>
            )}
        </Box>
    );
};

export default APToGIC;