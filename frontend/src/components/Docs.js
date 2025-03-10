import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Grid, Paper, Link, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

const Docs = () => {
    const theme = useTheme();
    const location = useLocation();
    const userName = location.state?.userName || "Usuario";

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
		const userId = localStorage.getItem("userId");

		if (!userId) {
			console.error("No hay un userId en localStorage.");
			setLoading(false);
			return;
		}

		// Obtener documentos del usuario desde el backend
		axios.get(`http://localhost:8080/api/documents/${userId}`)
			.then(response => {
				console.log("Respuesta del backend:", response.data);
				setDocuments(response.data);
			})
			.catch(error => {
				console.error("Error al obtener documentos:", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleDelete = async (docId) => {
		try {
			await axios.delete(`http://localhost:8080/api/documents/${docId}`);
			setDocuments(documents.filter(doc => doc.id !== docId));
		} catch (error) {
			console.error("Error al eliminar documento:", error);
		}
	};

    return (
        <Box
            sx={{
                backgroundColor: "#1A1A1A",
                minHeight: "75vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "2rem",
                color: "#FFFFFF",
            }}
        >
            {/* Mensaje de bienvenida */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "2rem",
                    fontFamily: "'Spicy Rice', cursive",
                    animation: "slideIn 0.8s ease-out",
                }}
            >
                ¡Bienvenido, {userName}!
            </Typography>

            <Typography
                variant="h5"
                sx={{
                    textAlign: "center",
                    marginBottom: "3rem",
                    fontFamily: "'Josefin Sans', sans-serif",
                }}
            >
                Aquí puedes ver y descargar los documentos generados o subidos en la web.
            </Typography>

            {loading ? (
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
            ) : (
                <Grid
					container
					spacing={4}
					sx={{
						maxWidth: "800px",
						maxHeight: "400px",
        				overflowY: "auto",
						alignItems: "stretch"
					}}>
                    {Array.isArray(documents) && documents.length > 0 ? (
                        documents.map((doc, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                key={index}
                                sx={{
                                    animation: `slideIn 0.8s ease-out ${index * 0.2}s`,
                                    marginBottom: "2rem",
                                }}
                            >
                                <Paper
                                    elevation={3}
                                    sx={{
                                        padding: "1rem",
                                        backgroundColor: theme.palette.secondary.main,
                                        color: "#FFFFFF",
                                        textAlign: "center",
                                        borderRadius: "10px",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: "'Spicy Rice', cursive",
                                            marginBottom: "0.5rem",
                                            fontSize: "1.2rem",
                                        }}
                                    >
                                        {doc.name}
                                    </Typography>
                                    <Link
                                        href={`http://localhost:8080/api/documents/download/${doc.id}`}
                                        download
                                        sx={{
                                            fontSize: "0.9rem",
                                            color: theme.palette.primary.main,
                                            fontFamily: "'Josefin Sans', sans-serif",
                                            textDecoration: "none",
                                            "&:hover": { textDecoration: "underline" },
                                        }}
                                    >
                                        Descargar
                                    </Link>
									<Button
										variant="contained"
										startIcon={<DeleteIcon />}
										onClick={() => handleDelete(doc.id)}
										sx={{
											marginTop: "1rem",
											fontFamily: "'Josefin Sans', sans-serif",
											backgroundColor: "#E4CCE8",
											color: "#000", // Asegura que el texto sea visible
											"&:hover": {
												backgroundColor: "#C9B1CC", // Un tono más oscuro en hover
											},
										}}
									>
										Eliminar
									</Button>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6" sx={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                            No hay documentos disponibles.
                        </Typography>
                    )}
                </Grid>
            )}

            {/* Animaciones */}
            <style>
                {`
                @keyframes slideIn {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                `}
            </style>
        </Box>
    );
};

export default Docs;
