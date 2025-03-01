import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Simulations = () => {
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
                Simulaciones
            </Typography>

            <Grid
                container
                spacing={3}
                sx={{
                    maxWidth: "800px",
                    alignItems: "stretch",
                }}
            >
                {[
                    {
                        label: "AFD",
                        description: "Simula el comportamiento de un autómata finito determinista.",
                        path: "/simulate-afd",
                    },
                    {
                        label: "AFND",
                        description: "Simula un autómata finito no determinista.",
                        path: "/simulate-afnd",
                    },
                ].map((simulation, index) => (
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
                            onClick={() => navigate(simulation.path)}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Spicy Rice', cursive",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {simulation.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }}
                            >
                                {simulation.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Separation */}
            <Box sx={{ marginTop: "5rem" }} />

            <Grid
                container
                spacing={3}
                sx={{
                    maxWidth: "800px",
                    alignItems: "stretch",
                }}
            >
                {[
                    {
                        label: "AP",
                        description: "Simula un autómata de pila con transiciones vacías.",
                        path: "/simulate-ap",
                    },
                    {
                        label: "MT",
                        description: "Simula el comportamiento de una máquina de Turing.",
                        path: "/simulate-mt",
                    },
                ].map((simulation, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        key={index}
                        sx={{
                            animation: `slideIn 0.8s ease-out ${index * 0.2 + 0.6}s`,
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
                            onClick={() => navigate(simulation.path)}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Spicy Rice', cursive",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {simulation.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }}
                            >
                                {simulation.description}
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

export default Simulations;
