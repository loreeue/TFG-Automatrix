import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MinimizeAFD = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate if a file is selected
        if (!file) {
            toast.error("Por favor selecciona un archivo AFD (.jff).", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Validate file extension
        if (!file.name.endsWith(".jff")) {
            toast.error("El archivo seleccionado no es un AFD válido (.jff).", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

		// Obtain the user ID from local storage
        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error("Error: No se encontró el ID del usuario. Inicia sesión de nuevo.", {
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
		formData.append("userId", userId);

        try {
            const response = await axios.post("/api/convert/afd-to-minimized-afd", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    responseType: "blob",
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "afd_minimized.jff");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error al minimizar AFD:", error);
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
                minHeight: "105vh",
                backgroundColor: "#1A1A1A",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#FFFFFF",
            }}
        >
            <ToastContainer />

            {/* Main title */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 3,
                    fontFamily: "'Spicy Rice', cursive",
                }}
            >
                Minimizar AFD
            </Typography>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
                {/* File upload button */}
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
                    Subir Archivo AFD (.jff)
                    <input
                        type="file"
                        hidden
                        accept=".jff"
                        onChange={handleFileChange}
                    />
                </Button>

                {/* Name file */}
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

                {/* Minimize button */}
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
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Minimizar AFD"}
                </Button>
            </form>
        </Box>
    );
};

export default MinimizeAFD;
