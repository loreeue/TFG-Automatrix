import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AFNDToAFD = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if a file has been selected
        if (!file) {
            toast.error("Por favor selecciona un archivo AFND (.jff).", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Verify that the file has the .jff extension
        if (!file.name.endsWith(".jff")) {
            toast.error("El archivo seleccionado no es un AFND válido (.jff).", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Read the file and verify that it is an AFND
        const readFileContent = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;

                    // Check if the file has the structure of a finite automaton
                    if (!content.includes("<structure>") || !content.includes("<type>fa</type>") || !content.includes("<automaton>")) {
                        resolve(false); // Isn't an AF
                        return;
                    }

                    // Check for empty transitions or multiple transitions with the same symbol (characteristic of an AFND)
                    const isAFND = content.includes("<read/>") || (content.match(/<read>/g) || []).length > (content.match(/<state>/g) || []).length;

                    resolve(isAFND);
                };
                reader.onerror = () => reject(false);
                reader.readAsText(file);
            });
        };

        const isValidAFND = await readFileContent(file);

        if (!isValidAFND) {
            toast.error("El archivo seleccionado no es un AFND válido. Por favor sube un archivo correcto.", {
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
            const response = await axios.post("/api/convert/afnd-to-afd", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    responseType: "blob",
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "afd_converted.jff");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error al convertir AFND a AFD:", error);
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
                Convertir AFND a AFD
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
                        "&:hover": {
                            backgroundColor: "#331832",
                        },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Subir Archivo AFND (.jff)
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
                        "&:hover": {
                            backgroundColor: "#331832",
                        },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir AFND a AFD"}
                </Button>
            </form>
        </Box>
    );
};

export default AFNDToAFD;
