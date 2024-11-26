import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Grid } from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TransformIcon from "@mui/icons-material/Transform";
import ValidationIcon from "@mui/icons-material/CheckCircle";
import logo from "../assets/logo.png";

const MainMenu = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start", // Mover todo hacia arriba
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: 3,
            }}
        >
            {/* Logo Automatrix */}
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
                <img
                    src={logo}
                    alt="Automatrix Logo"
                    style={{
                        width: "350px",
                        height: "auto",
                    }}
                />
            </Box>

            {/* Botones */}
            <Grid container spacing={2} sx={{ width: "80%" }}>
                <Grid
                    item
                    xs={3}
                    sx={{
                        animation: "slideIn 0.5s ease-out",
                        "@keyframes slideIn": {
                            from: { transform: "translateY(-50px)", opacity: 0 },
                            to: { transform: "translateY(0)", opacity: 1 },
                        },
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/gramaticas"
                        startIcon={<BookIcon />}
                        sx={{
                            width: "100%",
                            padding: "3rem",
                            fontSize: "1.2rem",
                            transition: "transform 0.3s, background-color 0.3s",
                            "&:hover": {
                                transform: "scale(1.1)",
                                backgroundColor: "primary.dark",
                            },
                        }}
                    >
                        Gramáticas
                    </Button>
                </Grid>
                <Grid
                    item
                    xs={3}
                    sx={{
                        animation: "slideIn 0.6s ease-out",
                        "@keyframes slideIn": {
                            from: { transform: "translateY(-50px)", opacity: 0 },
                            to: { transform: "translateY(0)", opacity: 1 },
                        },
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/afds"
                        startIcon={<CompareArrowsIcon />}
                        sx={{
                            width: "100%",
                            padding: "3rem",
                            fontSize: "1.2rem",
                            transition: "transform 0.3s, background-color 0.3s",
                            "&:hover": {
                                transform: "scale(1.1)",
                                backgroundColor: "primary.dark",
                            },
                        }}
                    >
                        AFDs
                    </Button>
                </Grid>
                <Grid
                    item
                    xs={3}
                    sx={{
                        animation: "slideIn 0.7s ease-out",
                        "@keyframes slideIn": {
                            from: { transform: "translateY(-50px)", opacity: 0 },
                            to: { transform: "translateY(0)", opacity: 1 },
                        },
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/transformaciones"
                        startIcon={<TransformIcon />}
                        sx={{
                            width: "100%",
                            padding: "3rem",
                            fontSize: "1.2rem",
                            transition: "transform 0.3s, background-color 0.3s",
                            "&:hover": {
                                transform: "scale(1.1)",
                                backgroundColor: "primary.dark",
                            },
                        }}
                    >
                        Transformaciones
                    </Button>
                </Grid>
                <Grid
                    item
                    xs={3}
                    sx={{
                        animation: "slideIn 0.8s ease-out",
                        "@keyframes slideIn": {
                            from: { transform: "translateY(-50px)", opacity: 0 },
                            to: { transform: "translateY(0)", opacity: 1 },
                        },
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/validaciones"
                        startIcon={<ValidationIcon />}
                        sx={{
                            width: "100%",
                            padding: "3rem",
                            fontSize: "1.2rem",
                            transition: "transform 0.3s, background-color 0.3s",
                            "&:hover": {
                                transform: "scale(1.1)",
                                backgroundColor: "primary.dark",
                            },
                        }}
                    >
                        Validaciones
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainMenu;