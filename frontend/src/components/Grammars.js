import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import { useTheme } from "@mui/material/styles";

const Grammars = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            sx={{
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
                    <BookIcon
                        sx={{
                            fontSize: "3rem",
                            verticalAlign: "middle",
                            marginRight: "0.5rem",
                            color: "primary.main",
                        }}
                    />
                    Gramáticas
                </Typography>
            </Box>

            {/* Botón */}
            <Box
                sx={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "center",
                    animation: "slideIn 0.8s ease-out",
                    "@keyframes slideIn": {
                        from: { transform: "translateY(50px)", opacity: 0 },
                        to: { transform: "translateY(0)", opacity: 1 },
                    },
                }}
            >
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/equivalent-grammars")}
                    startIcon={<BookIcon />}
                    sx={{
                        padding: "1.5rem 3rem",
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
                    }}
                >
                    Gramáticas Equivalentes
                </Button>
            </Box>
        </Box>
    );
};

export default Grammars;