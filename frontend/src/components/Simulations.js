import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ValidationIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";
import {purple} from "@mui/material/colors";

const Simulations = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const gradientAnimation = {
        background: `linear-gradient(-45deg, white, ${purple[300]})`,
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
        "@keyframes gradient": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
        },
    };

    return (
        <Box
            sx={{
                ...gradientAnimation,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: 3,
            }}
        >
            {/* Título */}
            <Box
                sx={{
                    marginTop: "3rem",
                    marginBottom: "2rem",
                    animation: "fadeIn 1s ease-out",
                    "@keyframes fadeIn": {
                        from: { opacity: 0 },
                        to: { opacity: 1 },
                    },
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#333",
                    }}
                >
                    <ValidationIcon
                        sx={{
                            fontSize: "3rem",
                            verticalAlign: "middle",
                            marginRight: "0.5rem",
                            color: theme.palette.primary.main,
                        }}
                    />
                    Validaciones
                </Typography>
            </Box>

            {/* Botones */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem", // Espaciado entre botones
                    animation: "slideIn 0.8s ease-out",
                    "@keyframes slideIn": {
                        from: { transform: "translateY(50px)", opacity: 0 },
                        to: { transform: "translateY(0)", opacity: 1 },
                    },
                }}
            >
                {/* Lista de botones */}
                {[
                    { label: "AFD", path: "/simulate-afd" },
                    { label: "AFND", path: "/simulate-afnd" },
                    { label: "AP", path: "/simulate-ap" },
                    { label: "MT", path: "/simulate-mt" },
                ].map((button, index) => (
                    <Button
                        key={index}
                        variant="contained"
                        size="large"
                        onClick={() => navigate(button.path)}
                        sx={{
                            padding: "1.5rem 2rem",
                            fontSize: "1.2rem",
                            backgroundColor: theme.palette.secondary.main,
                            color: "white",
                            borderRadius: "12px",
                            transition: "transform 0.3s, background-color 0.3s",
                            "&:hover": {
                                backgroundColor: theme.palette.primary.main,
                                transform: "scale(1.05)",
                            },
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                        }}
                    >
                        {button.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default Simulations;