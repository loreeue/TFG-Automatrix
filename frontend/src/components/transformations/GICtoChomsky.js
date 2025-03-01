import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GICToChomsky = () => {
    const [grammar, setGrammar] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const exampleGrammar = `{\n\t"production1":"S -> aA",\n\t"production2":"A -> b"\n}`;

    const handleCopyExample = () => {
        navigator.clipboard.writeText(exampleGrammar);
        toast.success("Ejemplo copiado al portapapeles!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation to verify that the grammar is complete
        if (!grammar.trim()) {
            toast.error("Por favor, introduce la gramática antes de continuar.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        let parsedGrammar;

        try {
            parsedGrammar = JSON.parse(grammar.trim());
        } catch (error) {
            toast.error("Error en el formato de la gramática. Asegúrate de seguir el ejemplo.", {
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
        setResult("");

        try {
            const response = await axios.post("/api/convert/gic-to-chomsky", {
                grammar: parsedGrammar,
            });

            setResult(response.data);
        } catch (error) {
            console.error("Error al convertir GIC a Forma Normal de Chomsky:", error);
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

    const handlePaste = (event, setGrammar) => {
        event.preventDefault(); // Prevent sticking with default formatting
        const pastedText = (event.clipboardData || window.clipboardData).getData("text");
        setGrammar(pastedText); // Set the pasted text correctly
    };

	const formatChomskyOutput = (rawOutput) => {
		// Remove everything before "V:"
		const cleaned = rawOutput.replace(/^.*V:/, "V:");

		// Separate the header part and the production part using "P:"
		const parts = cleaned.split(/P:\s*/);
		if (parts.length < 2) return null;

		const headerPart = parts[0].trim(); // Contains "V:", "T:" and "S:"
		const productionsPart = parts[1].trim(); // Contains the productions

		// Separate the header by lines
		const headerLines = headerPart.split("\n").map((line) => line.trim());
		let variables = "", terminals = "", start = "";

		headerLines.forEach((line) => {
		  if (line.startsWith("V:")) {
			variables = line.replace("V:", "").trim();
		  } else if (line.startsWith("T:")) {
			terminals = line.replace("T:", "").trim();
		  } else if (line.startsWith("S:")) {
			start = line.replace("S:", "").trim();
		  }
		});

		return { variables, terminals, start, productions: productionsPart };
	};

    return (
        <Box
            sx={{
                minHeight: "75vh",
                backgroundColor: "#1A1A1A",
				height: "110vh",
				overflowY: "auto",
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
                Convertir GIC a Forma Normal de Chomsky
            </Typography>

            <Box
                sx={{
                    marginBottom: 2,
                    padding: 2,
                    borderRadius: "8px",
                    backgroundColor: "#2C2C2C",
                    width: "100%",
                    maxWidth: "800px",
                }}
            >
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                    Instrucciones:
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                    Introduzca la gramática en formato JSON, siguiendo este ejemplo:
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#333333",
                        padding: 2,
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        color: "#FFFFFF",
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                    >
                        {exampleGrammar}
                    </Box>
                    <IconButton
                        onClick={handleCopyExample}
                        sx={{
                            marginLeft: 1,
                            backgroundColor: "#444444",
                            color: "#FFFFFF",
                            "&:hover": {
                                backgroundColor: "#555555",
                            },
                        }}
                    >
                        <ContentCopyIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Spicy Rice', cursive",
                        textAlign: "center",
                        marginBottom: 1,
                    }}
                >
                    Gramática
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={grammar}
                    onChange={(e) => setGrammar(e.target.value)}
                    onPaste={(e) => handlePaste(e, setGrammar)}
                    sx={{
                        backgroundColor: "#2C2C2C",
                        borderRadius: "8px",
                        "& .MuiInputBase-input": {
                            color: "#FFFFFF",
                            fontFamily: "'Josefin Sans', sans-serif",
                        },
                    }}
                    InputProps={{
                        style: { color: "#FFFFFF" },
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
                        "&:hover": {
                            backgroundColor: "#331832",
                        },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                        "Convertir GIC a Chomsky"
                    )}
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
                        minHeight: "200px",
                        maxHeight: "6¡400px",
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        color: "#FFFFFF",
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontFamily: "'Josefin Sans', sans-serif" }}
                    >
                        Gramática en Forma Normal de Chomsky:
                    </Typography>
                    {(() => {
						const formatted = formatChomskyOutput(result);
						if (formatted) {
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
								<Typography variant="body1" sx={{ mt: 2 }}>
								<strong>Producciones:</strong>
								</Typography>
								{formatted.productions.split("\n").map((line, index) => (
								<Typography key={index} variant="body2">
									{line}
								</Typography>
								))}
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

export default GICToChomsky;
