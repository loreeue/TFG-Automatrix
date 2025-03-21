import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Info = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const infoItems = [
        { label: "AFD", description: "Autómatas Finitos Deterministas", path: "/info/afd" },
        { label: "AFND", description: "Autómatas Finitos No Deterministas", path: "/info/afnd" },
        { label: "AP", description: "Autómatas a Pila", path: "/info/ap" },
        { label: "MT", description: "Máquinas de Turing", path: "/info/mt" },
        { label: "Gramáticas", description: "Tipos y Jerarquía de Chomsky", path: "/info/gramaticas" },
        { label: "Expresiones Regulares", description: "Descripción algebraica de lenguajes", path: "/info/expresiones" },
        { label: "Resumen", description: "Comparativa y conclusiones", path: "/info/resumen" },
    ];

    const topItems = infoItems.slice(0, 4);   // AFD, AFND, AP, MT
    const bottomItems = infoItems.slice(4);  // Gramáticas, Expresiones, Resumen

    return (
        <Box
            sx={{
                backgroundColor: "#1A1A1A",
                minHeight: { xs: "220vh", sm: "120vh", md: "105vh" },
                display: "flex",
                flexDirection: "column",
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
                Información
            </Typography>

            <Box sx={{ maxWidth: "900px", width: "100%", margin: "0 auto" }}>
                <Grid container spacing={3} justifyContent="center" sx={{ marginBottom: "2rem" }}>
                    {topItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: "1rem",
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
                                    minHeight: "10rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
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
                <Grid container spacing={3} justifyContent="center">
                    {bottomItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: "1rem",
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
                                    minHeight: "10rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
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
            </Box>

			{/* Help Button */}
			<Button
				variant="contained"
				sx={{
					marginTop: "3rem",
					padding: "1rem 2rem",
					borderRadius: "20px",
					fontFamily: "'Josefin Sans', sans-serif",
					fontSize: "1.2rem",
					backgroundColor: theme.palette.secondary.main,
					"&:hover": { backgroundColor: theme.palette.primary.main },
					animation: "fadeIn 1s ease-out",
				}}
				onClick={() => navigate("/info/uso-web")}
			>
				¿Cómo usar la web?
			</Button>

            {/* Animation */}
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

export default Info;
