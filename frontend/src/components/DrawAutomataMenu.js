import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const DrawAutomataMenu = () => {
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
                Dibujar Autómatas
            </Typography>

            {/* Options Buttons */}
            <Grid container spacing={3} justifyContent="center">
                {[
                    { label: "AFD", description: "Dibuja un AFD", path: "/draw_automata/afd" },
                    { label: "AFND", description: "Dibuja un AFND", path: "/draw_automata/afnd" },
                    { label: "AP", description: "Dibuja un AP", path: "/draw_automata/ap" },
                    { label: "MT", description: "Dibuja una MT", path: "/draw_automata/mt" },
                ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "2rem",
                                backgroundColor: theme.palette.secondary.main,
                                color: "#FFFFFF",
                                textAlign: "center",
                                borderRadius: "20px",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.main,
                                },
                                animation: `slideIn 0.8s ease-out ${index * 0.2}s`,
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Spicy Rice', cursive",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {item.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'Josefin Sans', sans-serif",
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                }}
                            >
                                {item.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
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

export default DrawAutomataMenu;
