import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SimulateAP = () => {
    const [file, setFile] = useState(null);
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
	const [simulationMode, setSimulationMode] = useState(null); // "final" o "empty"

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const validateFile = async () => {

		// Check if a file has been selected
        if (!file) {
            toast.error("Por favor selecciona un archivo AP (.jff).", { position: "top-right" });
            return false;
        }

		// Verify that the file has the .jff extension
        if (!file.name.endsWith(".jff")) {
            toast.error("El archivo seleccionado no es un AP válido (.jff).", { position: "top-right" });
            return false;
        }

        // Read the file and verify that it is a Battery Powered Automaton (AP)
        const readFileContent = (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;

                    // Check if the file has the structure of an AP
                    if (!content.includes("<structure>") || !content.includes("<type>pda</type>") || !content.includes("<automaton>")) {
                        resolve(false); // Is an AP
                        return;
                    }
                    resolve(true);
                };
                reader.readAsText(file);
            });
        };

        const isValidAP = await readFileContent(file);

        if (!isValidAP) {
            toast.error("El archivo seleccionado no es un AP válido. Por favor sube un archivo correcto.", { position: "top-right" });
            return false;
        }

        return true;
    };

    const handleSimulateClick = async () => {
        const isValid = await validateFile();
        if (!isValid) return;

        if (!input) {
            toast.error("Por favor ingresa una cadena de entrada.", { position: "top-right" });
            return;
        }

        setOpenDialog(true);
    };

	const handleDialogClose = () => {
    	setOpenDialog(false);
	};

    const handleSubmit = async () => {
		const userId = localStorage.getItem("userId");
		if (!userId) {
			toast.error("Error: No se encontró el ID del usuario. Inicia sesión de nuevo.");
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("input", input);

		try {
			const url = `/api/validate/ap/${simulationMode}?userId=${userId}`;
			const response = await axios.post(url, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			const accepted = response.data;
			setResult(
				accepted
					? "El AP SÍ reconoce esta cadena de entrada"
					: "El AP NO reconoce esta cadena de entrada"
			);
		} catch (error) {
			console.error(error);
			toast.error("Error en el servidor al procesar la simulación.");
		} finally {
			setLoading(false);
			setSimulationMode(null); // Reset
		}
	};

	useEffect(() => {
		if (simulationMode) {
			handleSubmit();
		}
	}, [simulationMode]);

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
                Simular AP
            </Typography>

            <form style={{ width: "100%", maxWidth: "800px" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Spicy Rice', cursive",
                        textAlign: "center",
                        marginBottom: 1,
                    }}
                >
                    Subir Archivo AP (.jff)
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
                        "& .MuiInputBase-input": {
                            fontFamily: "'Josefin Sans', sans-serif",
                            color: "#FFFFFF",
                        },
                    }}
                    InputProps={{
                        style: { fontFamily: "'Josefin Sans', sans-serif", color: "#FFFFFF" }
                    }}
                />
                <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    onClick={handleSimulateClick}
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

            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#2C2C2C",
                        color: "#FFFFFF",
                        borderRadius: "10px",
                        padding: "1rem",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontFamily: "'Spicy Rice', cursive",
                        textAlign: "center",
                    }}
                >
                    Atención
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            fontFamily: "'Josefin Sans', sans-serif",
                            color: "#FFFFFF",
                            textAlign: "center",
                        }}
                    >
                        Es necesario que especifiques en JFLAP el tipo de Autómata a Pila.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
					<Button
						onClick={() => {
							setSimulationMode("final");
							handleDialogClose();
						}}
						sx={{
							backgroundColor: "#694D75",
							color: "#FFFFFF",
							fontFamily: "'Josefin Sans', sans-serif",
							"&:hover": { backgroundColor: "#331832" },
						}}
					>
						Por Estado Final
					</Button>
					<Button
						onClick={() => {
							setSimulationMode("empty");
							handleDialogClose();
						}}
						sx={{
							backgroundColor: "#694D75",
							color: "#FFFFFF",
							fontFamily: "'Josefin Sans', sans-serif",
							"&:hover": { backgroundColor: "#331832" },
						}}
					>
						Por Vaciado de Pila
					</Button>
				</DialogActions>
            </Dialog>
        </Box>
    );
};

export default SimulateAP;
