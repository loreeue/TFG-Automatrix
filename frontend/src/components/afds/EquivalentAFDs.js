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
                height: "100vh",
                backgroundColor: "#1A1A1A",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#FFFFFF",
            }}
        >
            {/* Título principal */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 3,
                    fontFamily: "'Spicy Rice', cursive",
                }}
            >
                Verificar Equivalencia de AFDs
            </Typography>

            {/* Formulario */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
                {/* Botón para subir archivo 1 */}
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{
                        marginBottom: 2,
                        padding: "1rem",
                        borderRadius: "8px",
                        backgroundColor: "#694D75",
                        "&:hover": {
                            backgroundColor: "#331832",
                        },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Subir Archivo AFD 1 (.jff)
                    <input
                        type="file"
                        hidden
                        accept=".jff"
                        onChange={handleFile1Change}
                    />
                </Button>

                {/* Nombre del archivo 1 */}
                {file1 && (
                    <Typography
                        variant="body2"
                        sx={{
                            marginBottom: 2,
                            textAlign: "center",
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                    >
                        Archivo seleccionado 1: {file1.name}
                    </Typography>
                )}

                {/* Botón para subir archivo 2 */}
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{
                        marginBottom: 2,
                        padding: "1rem",
                        borderRadius: "8px",
                        backgroundColor: "#694D75",
                        "&:hover": {
                            backgroundColor: "#331832",
                        },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Subir Archivo AFD 2 (.jff)
                    <input
                        type="file"
                        hidden
                        accept=".jff"
                        onChange={handleFile2Change}
                    />
                </Button>

                {/* Nombre del archivo 2 */}
                {file2 && (
                    <Typography
                        variant="body2"
                        sx={{
                            marginBottom: 2,
                            textAlign: "center",
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                    >
                        Archivo seleccionado 2: {file2.name}
                    </Typography>
                )}

                {/* Botón para comparar */}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                        padding: "1rem",
                        borderRadius: "8px",
                        backgroundColor: "#694D75",
                        "&:hover": {
                            backgroundColor: "#331832",
                        },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Comparar AFDs"}
                </Button>
            </form>

            {/* Resultado */}
            {result && (
                <Typography
                    variant="h6"
                    sx={{
                        marginTop: 3,
                        textAlign: "center",
                        color: "#FFFFFF", // Cambiado a blanco
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {result}
                </Typography>
            )}
        </Box>
    );
};

export default EquivalentAFDs;