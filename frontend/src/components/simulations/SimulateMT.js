import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SimulateMT = () => {
    const [file, setFile] = useState(null);
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            toast.error("Por favor selecciona un archivo.", { position: "top-right" });
            return;
        }
        if (!input) {
            toast.error("Por favor ingresa una cadena de entrada.", { position: "top-right" });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("input", input);

        try {
            const response = await axios.post("/api/validate/turingMachine", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResult("Error: " + error.message);
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
                Simular MT
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Spicy Rice', cursive",
                        textAlign: "center",
                        marginBottom: 1,
                    }}
                >
                    Subir Archivo MT (.jff)
                </Typography>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{
                        marginBottom: 2,
                        backgroundColor: "#694D75",
                        "&:hover": { backgroundColor: "#331832" },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Seleccionar Archivo
                    <input type="file" hidden accept=".jff" onChange={handleFileChange} />
                </Button>
                {file && (
                    <Typography variant="body2"
                        sx={{
                            marginBottom: 2,
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                    >
                        Archivo seleccionado: {file.name}
                    </Typography>
                )}
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Spicy Rice', cursive",
                        textAlign: "center",
                        marginBottom: 1,
                    }}
                >
                    Cadena de Entrada
                </Typography>
                <TextField
                    label=""
                    variant="outlined"
                    fullWidth
                    value={input}
                    onChange={handleInputChange}
                    sx={{
                        backgroundColor: "#2C2C2C",
                        borderRadius: "8px",
                        input: { color: "#FFFFFF" },
                    }}
                />
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
                        "&:hover": { backgroundColor: "#331832" },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Simular"}
                </Button>
            </form>

            {result && (
                <Box
                    sx={{
                        marginTop: 3,
                        padding: 2,
                        border: "1px solid #444444",
                        borderRadius: "8px",
                        backgroundColor: "#2C2C2C",
                        width: "100%",
                        maxWidth: "800px",
                        minHeight: "100px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        fontFamily: "monospace",
                        color: "#FFFFFF",
                    }}
                >
                    <Typography variant="h6" gutterBottom
                        sx={{
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                    >
                        Resultado:
                    </Typography>
                    {result}
                </Box>
            )}
        </Box>
    );
};

export default SimulateMT;