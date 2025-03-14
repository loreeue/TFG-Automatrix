import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

		const userId = localStorage.getItem("userId");
		if (!userId) {
			toast.error("Debes iniciar sesión antes de comparar AFDs.", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

        // Verify that both files have been selected
        if (!file1 || !file2) {
            toast.error("Por favor, selecciona ambos archivos AFD (.jff).", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Verify that both files have the .jff extension
        if (!file1.name.endsWith(".jff") || !file2.name.endsWith(".jff")) {
            toast.error("Ambos archivos deben ser AFD en formato .jff.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Read the files and verify that they contain a valid AFD
        const readFileContent = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    if (content.includes("<structure>") && content.includes("<type>fa</type>") && content.includes("<automaton>")) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                };
                reader.onerror = () => reject(false);
                reader.readAsText(file);
            });
        };

        const isFile1Valid = await readFileContent(file1);
        const isFile2Valid = await readFileContent(file2);

        if (!isFile1Valid || !isFile2Valid) {
            toast.error("Uno o ambos archivos no parecen ser AFDs válidos. Verifica su contenido.", {
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
        formData.append("file1", file1);
        formData.append("file2", file2);
		formData.append("userId", userId);

        try {
            const response = await axios.post("/api/extra/compare-afds", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error al comparar AFDs:", error);
            toast.error("Error en el servidor al procesar la comparación.", {
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
                Verificar Equivalencia de AFDs
            </Typography>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
                {/* File upload button 1*/}
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

                {/* Name file 1 */}
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

                {/* File upload button 2 */}
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

                {/* Name file 2 */}
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

                {/* Compare button */}
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

            {/* Result */}
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

export default EquivalentAFDs;
