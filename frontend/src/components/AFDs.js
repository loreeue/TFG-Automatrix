import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import "@fontsource/josefin-sans";

const AFDs = () => {
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
            {/* Main title */}
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

            {/* Operations list */}
            <Grid
                container
                spacing={3}
                sx={{
                    maxWidth: "1200px",
                    alignItems: "stretch",
                }}
            >
                {[
                    {
                        label: "AFD → AFD Mínimo",
                        description: "Convierte un AFD en su versión mínima optimizando estados redundantes.",
                        path: "/minimize-afd",
                    },
                    {
                        label: "AFDs Equivalentes",
                        description: "Compara dos AFDs para verificar si aceptan el mismo lenguaje.",
                        path: "/equivalent-afds",
                    },
                ].map((operation, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
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
                            onClick={() => navigate(operation.path)}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Spicy Rice', cursive",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {operation.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }}
                            >
                                {operation.description}
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
