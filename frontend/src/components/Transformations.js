import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Transformations = () => {
    const navigate = useNavigate();
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
            }}
        >
            {/* Título principal */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "3rem",
                    fontFamily: "'Spicy Rice', cursive",
                    animation: "slideIn 0.8s ease-out",
                }}
            >
                Transformaciones
            </Typography>

            {/* Primera fila de transformaciones */}
            <Grid container spacing={3} sx={{ maxWidth: "1200px", alignItems: "stretch" }}>
                {[
                    { label: "AFND → AFD", description: "Convierte un AFND a su equivalente AFD.", path: "/afnd-to-afd" },
                    { label: "GLD → AFD", description: "Transforma una gramática GLD en un AFD.", path: "/gld-to-afd" },
                    { label: "AFD → ER", description: "Genera la expresión regular equivalente a un AFD.", path: "/afd-to-er" },
                ].map((transformation, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        sx={{
                            animation: `slideIn 0.8s ease-out ${index * 0.2}s`,
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "2rem",
                                backgroundColor: theme.palette.secondary.main,
                                color: "#FFFFFF",
                                textAlign: "center",
                                borderRadius: "12px",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.main,
                                },
                            }}
                            onClick={() => navigate(transformation.path)}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Spicy Rice', cursive",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {transformation.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }}
                            >
                                {transformation.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Segunda fila de transformaciones con separación */}
            <Grid container spacing={3} sx={{ maxWidth: "1200px", alignItems: "stretch", marginTop: "4rem" }}>
                {[
                    { label: "AP → GIC", description: "Convierte un autómata de pila a su gramática equivalente.", path: "/ap-to-gic" },
                    { label: "GIC → AP", description: "Convierte una gramática independiente de contexto en un autómata de pila.", path: "/gic-to-ap" },
                    { label: "GIC → Chomsky", description: "Convierte una gramática independiente de contexto en su forma normal de Chomsky.", path: "/gic-to-chomsky" },
                ].map((transformation, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index + 3} // Para evitar conflicto de claves con la primera fila
                        sx={{
                            animation: `slideIn 0.8s ease-out ${(index + 3) * 0.2}s`,
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "2rem",
                                backgroundColor: theme.palette.secondary.main,
                                color: "#FFFFFF",
                                textAlign: "center",
                                borderRadius: "12px",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.main,
                                },
                            }}
                            onClick={() => navigate(transformation.path)}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Spicy Rice', cursive",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {transformation.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }}
                            >
                                {transformation.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

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

export default Transformations;