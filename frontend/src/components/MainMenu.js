import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MainMenu = () => {
    const theme = useTheme();

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
                fontFamily: "'Raleway', sans-serif"
            }}
        >
            {/* Secciones informativas */}
            <Grid container spacing={3} sx={{ maxWidth: "1200px", marginTop: "3rem" }}>
                {[
                    {
                        title: "Automatización",
                        description:
                            "Resuelve ejercicios de autómatas y lenguajes formales de manera automática.",
                    },
                    {
                        title: "Visualización",
                        description:
                            "Genera representaciones gráficas de AFDs, máquinas de Turing y más.",
                    },
                    {
                        title: "Validación",
                        description:
                            "Comprueba la equivalencia entre gramáticas y verifica sus propiedades.",
                    },
                ].map((section, index) => (
                    <Grid
                        item
                        xs={12}
                        md={4}
                        key={index}
                        sx={{
                            animation: `slideIn 0.8s ease-out ${index * 0.2}s`, // Animación para cada elemento con un delay
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "2rem",
                                backgroundColor: theme.palette.secondary.main,
                                color: "#FFFFFF",
                                textAlign: "center",
                                borderRadius: "20px",
                                height: "400px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start", // Posiciona el contenido arriba
                                alignItems: "center",
                                paddingTop: "2rem",
                                transition: "background-color 0.3s",
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.main,
                                },
                            }}
                        >
                            <Typography
                                variant="h4" // Título más grande
                                sx={{
                                    fontWeight: "700",
                                    fontFamily: "'Spicy Rice', cursive", // Fuente Spicy Rice
                                    marginBottom: "1rem",
                                    textAlign: "center",
                                }}
                            >
                                {section.title}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                    textAlign: "center",
                                    marginTop: "2rem",
                                    padding: "0 1rem",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }}
                            >
                                {section.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Definición de animación */}
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

export default MainMenu;