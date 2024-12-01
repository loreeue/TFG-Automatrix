import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const EquivalentAFDs = () => {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleFile1Change = (event) => {
        setFile1(event.target.files[0]);
    };

    const handleFile2Change = (event) => {
        setFile2(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file1 || !file2) {
            setResult("Por favor selecciona ambos archivos.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file1", file1);
        formData.append("file2", file2);

        try {
            const response = await axios.post("/api/extra/compare-afds", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error al comparar AFDs:", error);
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
                justifyContent: "flex-start",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Verificar Equivalencia de AFDs
            </Typography>
            <form onSubmit={handleSubmit}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                >
                    Subir Archivo AFD 1 (.jff)
                    <input
                        type="file"
                        hidden
                        accept=".jff"
                        onChange={handleFile1Change}
                    />
                </Button>
                {file1 && (
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        Archivo seleccionado 1: {file1.name}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                >
                    Subir Archivo AFD 2 (.jff)
                    <input
                        type="file"
                        hidden
                        accept=".jff"
                        onChange={handleFile2Change}
                    />
                </Button>
                {file2 && (
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        Archivo seleccionado 2: {file2.name}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Comparar AFDs"}
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

export default EquivalentAFDs;