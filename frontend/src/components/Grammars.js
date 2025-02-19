import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Grammars = () => {
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
                Gramáticas
            </Typography>

            {/* Caja principal */}
            <Paper
                elevation={3}
                sx={{
                    padding: "2rem",
                    backgroundColor: theme.palette.secondary.main,
                    color: "#FFFFFF",
                    textAlign: "center",
                    borderRadius: "20px",
                    width: "80%",
                    maxWidth: "800px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                    },
                    animation: "slideIn 0.8s ease-out",
                }}
                onClick={() => navigate("/equivalent-grammars")}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Spicy Rice', cursive",
                        marginBottom: "1rem",
                    }}
                >
                    Gramáticas Equivalentes
                </Typography>
                <Typography
                    sx={{
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Compara gramáticas para determinar si generan el mismo lenguaje.
                </Typography>
            </Paper>

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

export default Grammars;