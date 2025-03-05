import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

const Docs = () => {
    const theme = useTheme();
    const location = useLocation();

    const userName = location.state?.userName || "Usuario";

    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // Simulación de carga de documentos desde un backend
        setTimeout(() => {
            setDocuments([
                { name: "Automata_AFD.jff", url: "/files/Automata_AFD.jff" },
                { name: "Automata_AP.jff", url: "/files/Automata_AP.jff" },
                { name: "Maquina_Turing.jff", url: "/files/Maquina_Turing.jff" },
            ]);
        }, 1000);
    }, []);

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
            {/* Welcome message */}
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

            <Grid container spacing={4} sx={{ maxWidth: "800px", alignItems: "stretch" }}>
                {documents.length > 0 ? (
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
                                    href={doc.url}
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
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" sx={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                        No hay documentos disponibles.
                    </Typography>
                )}
            </Grid>

            {/* Animations */}
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
