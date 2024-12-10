import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const AFDs = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: "#1A1A1A",
                minHeight: "100vh",
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
                AFDs: Operaciones y Transformaciones
            </Typography>

            {/* Lista de operaciones */}
            <Grid
                container
                spacing={3}
                sx={{
                    maxWidth: "1200px",
                    alignItems: "stretch", // Asegura que todos los elementos del grid tengan la misma altura
                }}
            >
                {[
                    { label: "AFD → AFD Mínimo", path: "/minimize-afd" },
                    { label: "AFDs Equivalentes", path: "/equivalent-afds" },
                ].map((operation, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                            display: "flex", // Asegura que los elementos ocupen toda la altura
                        }}
                        key={index}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "1.5rem 2rem",
                                backgroundColor: theme.palette.secondary.main,
                                color: "#FFFFFF",
                                textAlign: "center",
                                borderRadius: "12px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                cursor: "pointer",
                                width: "100%", // Ocupa todo el ancho de la celda
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.main,
                                },
                            }}
                            onClick={() => navigate(operation.path)}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Spicy Rice', cursive",
                                    marginBottom: "1rem",
                                }}
                            >
                                {operation.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                }}
                            >
                                {index === 0
                                    ? "Convierte un AFD en su versión mínima optimizando estados redundantes."
                                    : "Compara dos AFDs para verificar si aceptan el mismo lenguaje."}
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

export default AFDs;