import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const MinimizeAFD = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
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
            const response = await axios.post("/api/convert/afd-to-minimized-afd", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    responseType: "blob", // Indica que se espera un archivo binario
                },
            });

            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "afd_minimized.jff"); // Nombre del archivo descargado
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error al minimizar AFD:", error);
            alert("Error: No se pudo procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Minimizar AFD
            </Typography>
            <form onSubmit={handleSubmit}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                >
                    Subir Archivo AFD (.jff)
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
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Minimizar AFD"}
                </Button>
            </form>
        </Box>
    );
};

export default MinimizeAFD;