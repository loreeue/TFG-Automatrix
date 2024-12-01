import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useTheme } from "@mui/material/styles";
import {purple} from "@mui/material/colors";

const AFDs = () => {
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
                    <CompareArrowsIcon
                        sx={{
                            fontSize: "3rem",
                            verticalAlign: "middle",
                            marginRight: "0.5rem",
                            color: theme.palette.primary.main,
                        }}
                    />
                    AFDs
                </Typography>
            </Box>

            {/* Botones */}
            <Grid
                container
                spacing={2}
                sx={{
                    width: "80%",
                    justifyContent: "center",
                    animation: "slideIn 0.8s ease-out",
                    "@keyframes slideIn": {
                        from: { transform: "translateY(50px)", opacity: 0 },
                        to: { transform: "translateY(0)", opacity: 1 },
                    },
                }}
            >
                <Grid item>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/minimize-afd")}
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
                        AFD → AFD Mínimo
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/equivalent-afds")}
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
                        AFDs Equivalentes
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AFDs;