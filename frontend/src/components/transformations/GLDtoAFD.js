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

const GLDToAFD = () => {
    const [grammar, setGrammar] = useState("");
    const [loading, setLoading] = useState(false);

    const exampleGrammar = '{\n\t"production1":"S -> aA",\n\t"production2":"A -> b"\n}';

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

		// Obtain the userId from localStorage
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

        try {
            const response = await axios.post(
				`/api/convert/gld-to-afd?userId=${userId}`,
				{ grammar: parsedGrammar },
				{ responseType: "blob" }
			);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "afd_from_gld.jff");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error al convertir GLD a AFD:", error);
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
                Convertir GLD a AFD
            </Typography>

            <Box
                sx={{
                    marginBottom: 3,
                    padding: 3,
                    borderRadius: "8px",
                    backgroundColor: "#2C2C2C",
                    width: "100%",
                    maxWidth: "800px",
                }}
            >
                <Typography variant="h6" gutterBottom
                    sx={{
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Instrucciones:
                </Typography>
                <Typography variant="body1" gutterBottom
                    sx={{
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
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
                    >{exampleGrammar}</Box>
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
                        color: "#FFFFFF",
                    }}
                >
                    Gramática
                </Typography>
                <TextField
                    label=""
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={6}
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
                        style: { color: "#FFFFFF" }
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
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Convertir GLD a AFD"}
                </Button>
            </form>
        </Box>
    );
};

export default GLDToAFD;
