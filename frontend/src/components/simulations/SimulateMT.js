import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    CircularProgress,
} from "@mui/material";

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
            setResult("Por favor selecciona un archivo.");
            return;
        }
        if (!input) {
            setResult("Por favor ingresa una cadena de entrada.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("input", input);

        try {
            const response = await axios.post(
                "/api/validate/turingMachine",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
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
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: 3,
            }}
        >
            <Card sx={{ width: 500, padding: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Simular MT
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Archivo */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                >
                                    Subir Archivo MT (.jff)
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
                                        color="text.secondary"
                                        sx={{ marginTop: 1 }}
                                    >
                                        Archivo seleccionado: {file.name}
                                    </Typography>
                                )}
                            </Grid>

                            {/* Cadena de Entrada */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Cadena de Entrada"
                                    variant="outlined"
                                    fullWidth
                                    value={input}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            {/* Botón de Simulación */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: "white",
                                            }}
                                        />
                                    ) : (
                                        "Simular"
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    {/* Resultado */}
                    {result && (
                        <Box sx={{ marginTop: 3 }}>
                            <Typography
                                variant="h6"
                                color={result.startsWith("Error") ? "error" : "primary"}
                                align="center"
                            >
                                {result}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default SimulateMT;