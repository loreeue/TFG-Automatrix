import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TransformIcon from "@mui/icons-material/Transform";
import ValidationIcon from "@mui/icons-material/CheckCircle";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import {useTheme} from "@mui/material/styles";

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 2rem",
                backgroundColor: theme.palette.secondary.main,
                color: "#FFFFFF",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            }}
        >
            {/* Izquierda: Logo y botones */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {/* Logo */}
                <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FFFFFF" }}>
                    Automatrix
                </span>

                {/* Botones principales */}
                <Button
                    variant="text"
                    component={Link}
                    to="/gramaticas"
                    startIcon={<BookIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    Gramáticas
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/afds"
                    startIcon={<CompareArrowsIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    AFDs
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/transformaciones"
                    startIcon={<TransformIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    Transformaciones
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/validaciones"
                    startIcon={<ValidationIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    Validaciones
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/draw_automata"
                    startIcon={<AutoGraphIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    Dibujar Autómata
                </Button>
            </Box>

            {/* Derecha: Botones adicionales */}
            <Box sx={{ display: "flex", gap: "1rem" }}>
                <Button
                    variant="outlined"
                    component={Link}
                    to="/"
                    sx={{
                        color: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": { borderColor: theme.palette.secondary.main, color: theme.palette.primary.main },
                    }}
                >
                    Inicio
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": { backgroundColor: theme.palette.secondary.main },
                    }}
                    onClick={() => navigate(-1)}
                >
                    Atrás
                </Button>
            </Box>
        </Box>
    );
};

export default Header;