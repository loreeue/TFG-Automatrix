import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const APToGIC = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setResult(""); // Reset result when a new file is selected
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert("Por favor selecciona un archivo.");
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

            // Set the resulting grammar as text in the UI
            setResult(response.data);
        } catch (error) {
            console.error("Error al convertir AP a GIC:", error);
            setResult("Error: No se pudo procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 3,
                backgroundColor: "#f5f5f5",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Convertir AP a GIC
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "600px" }}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ marginBottom: 2 }}
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
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir AP a GIC"}
                </Button>
            </form>

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
                        fontFamily: "monospace", // Use monospaced font for clarity
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Gramática Independiente de Contexto:
                    </Typography>
                    {result}
                </Box>
            )}
        </Box>
    );
};

export default APToGIC;