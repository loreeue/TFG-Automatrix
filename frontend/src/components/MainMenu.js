import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import imgHome1 from "../assets/img-home1.png";
import imgHome2 from "../assets/img-home2.png";
import imgHome3 from "../assets/img-home3.png";

const MainMenu = () => {
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
                fontFamily: "'Raleway', sans-serif"
            }}
        >
            {/* Informative sections */}
            <Grid container spacing={3} sx={{ maxWidth: "1200px", marginTop: "3rem" }}>
                {[
                    {
                        title: "Automatización",
                        description:
                            "Resuelve ejercicios de autómatas y lenguajes de manera automática.",
						image: imgHome1
                    },
                    {
                        title: "Visualización",
                        description:
                            "Genera representaciones gráficas de AFDs, máquinas de Turing y más.",
						image: imgHome2
                    },
                    {
                        title: "Validación",
                        description:
                            "Comprueba la equivalencia entre gramáticas y verifica sus propiedades.",
						image: imgHome3
                    },
                ].map((section, index) => (
                    <Grid
                        item
                        xs={12}
                        md={4}
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
							borderRadius: "20px",
							height: "500px",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							alignItems: "center",
							cursor: "pointer",
							"&:hover": {
								backgroundColor: theme.palette.primary.main,
								transform: "scale(1.05)",
								boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.2)",
							},
							transition: "transform 0.3s ease, box-shadow 0.3s ease",
						}}
					>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: "700",
                                    fontFamily: "'Spicy Rice', cursive",
                                    marginBottom: "1rem",
                                    textAlign: "center",
                                }}
                            >
                                {section.title}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                    textAlign: "center",
                                    marginTop: "2rem",
                                    padding: "0 1rem",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }}
                            >
                                {section.description}
                            </Typography>
							<img
								src={section.image}
								alt={section.title}
								style={{
									width: "400px",
									height: "400px",
									objectFit: "contain"
								}}
							/>
                        </Paper>

                    </Grid>
                ))}
            </Grid>

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

export default MainMenu;
