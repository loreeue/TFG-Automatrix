import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AFDToER = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setResult("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

		// Check if a file has been selected
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

		// Verify that the file has the .jff extension
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

        // Read the file and verify that it is an AFD
        const readFileContent = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;

                    // Check if it has the structure of a finite automaton
                    if (!content.includes("<structure>") || !content.includes("<type>fa</type>") || !content.includes("<automaton>")) {
                        resolve(false);
                        return;
                    }

                    // Improved checking for AFND
                    const isAFND = content.includes("<read/>") || content.match(/<transition>/g)?.length > content.match(/<state>/g)?.length;
                    resolve(!isAFND); // If it is AFND, it is rejected
                };
                reader.onerror = () => reject(false);
                reader.readAsText(file);
            });
        };

        const isValidAFD = await readFileContent(file);

        if (!isValidAFD) {
            toast.error("El archivo seleccionado no es un AFD válido. Sube un archivo correcto.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

		// Obtener el userId de localStorage
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

        try {
            const response = await axios.post(
				`/api/convert/afd-to-er?userId=${userId}`,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);

            if (response.data.startsWith("Error") || response.data.includes("no se puede convertir")) {
                toast.error("No se pudo convertir el AFD a Expresión Regular.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setResult(response.data);
            } else {
                toast.success("Conversión exitosa. Expresión Regular generada.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setResult(`Expresión Regular Generada: ${response.data}`);
            }
        } catch (error) {
            console.error("Error al convertir AFD a ER:", error);
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
            <Typography
                variant="h3"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 3,
                    fontFamily: "'Spicy Rice', cursive",
                }}
            >
                Convertir AFD a Expresión Regular
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
                    Subir Archivo AFD (.jff)
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
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir AFD a ER"}
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

export default AFDToER;
