import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress, Grid } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const APToGIC = () => {
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
            toast.error("Por favor selecciona un archivo AP (.jff).", {
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
            toast.error("El archivo seleccionado no es un AP válido (.jff).", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Read the file and verify that it is an AP
        const readFileContent = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;

                    // Check if it has the structure of an automaton and is an AP
                    if (!content.includes("<structure>") || !content.includes("<type>pda</type>") || !content.includes("<automaton>")) {
                        resolve(false);
                        return;
                    }

                    resolve(true);
                };
                reader.onerror = () => reject(false);
                reader.readAsText(file);
            });
        };

        const isValidAP = await readFileContent(file);

        if (!isValidAP) {
            toast.error("El archivo seleccionado no es un AP válido. Por favor sube un archivo correcto.", {
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
				`/api/convert/ap-to-gic?userId=${userId}`,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);

            setResult(response.data);
        } catch (error) {
            console.error("Error al convertir AP a GIC:", error);
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

	const formatGrammarOutput = (rawOutput) => {
		// Elimina todo lo anterior a "V:"
		const cleaned = rawOutput.replace(/^.*V:/, "V:");

		// Separamos por las etiquetas clave
		const [vPart, tPartAndRest] = cleaned.split("T:");
		if (!tPartAndRest) return null;

		const [tPart, sPartAndRest] = tPartAndRest.split("S:");
		if (!sPartAndRest) return null;

		const [sPart, pPart] = sPartAndRest.split("P:");
		if (!pPart) return null;

		const variablesClean = vPart
		  .replace("V:", "")
		  .trim()
		  .replace(/^grammar\.cfg\.ContextFreeGrammar@\w+\s*/, "");

		return {
		  variables: variablesClean,
		  terminals: tPart.trim(),
		  start: sPart.trim(),
		  productions: '\n' + pPart.trim(),
		};
	};

    return (
        <Box
            sx={{
                minHeight: "75vh",
                backgroundColor: "#1A1A1A",
                padding: 3,
                display: "flex",
				height: "100vh",
				overflowY: "auto",
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
                Convertir AP a GIC
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
                        "&:hover": { backgroundColor: "#331832" },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
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
                        "&:hover": { backgroundColor: "#331832" },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir AP a GIC"}
                </Button>
            </form>

            {result && (
                <Box
                    sx={{
                        marginTop: 3,
                        padding: 2,
                        borderRadius: "8px",
                        backgroundColor: "#2C2C2C",
                        width: "100%",
                        maxWidth: "800px",
                        color: "#FFFFFF",
                        fontFamily: "monospace",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            marginBottom: 1,
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                    >
                        Gramática Independiente de Contexto:
                    </Typography>
                    {(() => {
						const formatted = formatGrammarOutput(result);
						if (formatted) {
							// Separamos las producciones en líneas
							const productionLines = formatted.productions.trim().split("\n").filter(line => line.trim() !== "");
							// Dividimos el arreglo en dos partes iguales (o casi iguales)
							const midIndex = Math.ceil(productionLines.length / 2);
							const leftColumn = productionLines.slice(0, midIndex);
							const rightColumn = productionLines.slice(midIndex);

							return (
							<Box>
								<Typography variant="body1">
								<strong>Variables:</strong> {formatted.variables}
								</Typography>
								<Typography variant="body1">
								<strong>Terminales:</strong> {formatted.terminals}
								</Typography>
								<Typography variant="body1">
								<strong>Símbolo Inicial:</strong> {formatted.start}
								</Typography>
								<Box sx={{ mt: 2 }}>
								<Typography variant="body1" sx={{ mb: 1 }}>
									<strong>Producciones:</strong>
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={6}>
									{leftColumn.map((line, index) => (
										<Typography key={`left-${index}`} variant="body2">
										{line}
										</Typography>
									))}
									</Grid>
									<Grid item xs={6}>
									{rightColumn.map((line, index) => (
										<Typography key={`right-${index}`} variant="body2">
										{line}
										</Typography>
									))}
									</Grid>
								</Grid>
								</Box>
							</Box>
							);
						} else {
							return <Typography>{result}</Typography>;
						}
					})()}
                </Box>
            )}
        </Box>
    );
};

export default APToGIC;
