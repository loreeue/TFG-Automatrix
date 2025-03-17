import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Transformations = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const transformationsFirst = [
    { label: "AFND → AFD", description: "Convierte un AFND a su equivalente AFD.", path: "/afnd-to-afd" },
    { label: "GLD → AFD", description: "Transforma una gramática GLD en un AFD.", path: "/gld-to-afd" },
    { label: "AFD → ER", description: "Genera la expresión regular equivalente a un AFD.", path: "/afd-to-er" },
  ];

  const transformationsSecond = [
    { label: "AP → GIC", description: "Convierte un autómata de pila a su gramática equivalente.", path: "/ap-to-gic" },
    { label: "GIC → AP", description: "Convierte una gramática independiente de contexto en un autómata de pila.", path: "/gic-to-ap" },
    { label: "GIC → Chomsky", description: "Convierte una gramática independiente de contexto en su forma normal de Chomsky.", path: "/gic-to-chomsky" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#1A1A1A",
        minHeight: { xs: "150vh", sm: "110vh", md: "110vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "2rem",
        color: "#FFFFFF",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: "3rem",
          fontFamily: "'Spicy Rice', cursive",
          animation: "slideIn 0.8s ease-out",
        }}
      >
        Transformaciones
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
        }}
      >
        <Grid container spacing={6} alignItems="stretch">
          {transformationsFirst.map((transformation, index) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              key={index}
              sx={{ animation: `slideIn 0.8s ease-out ${index * 0.2}s` }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: "2rem",
                  backgroundColor: theme.palette.secondary.main,
                  color: "#FFFFFF",
                  textAlign: "center",
                  borderRadius: "12px",
                  minHeight: { xs: "auto", md: "170px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                onClick={() => navigate(transformation.path)}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Spicy Rice', cursive",
                    mb: "0.5rem",
                  }}
                >
                  {transformation.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    fontFamily: "'Josefin Sans', sans-serif",
                  }}
                >
                  {transformation.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={6} alignItems="stretch">
          {transformationsSecond.map((transformation, index) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              key={index + 3}
              sx={{ animation: `slideIn 0.8s ease-out ${(index + 3) * 0.2}s` }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: "2rem",
                  backgroundColor: theme.palette.secondary.main,
                  color: "#FFFFFF",
                  textAlign: "center",
                  borderRadius: "12px",
                  minHeight: { xs: "auto", md: "170px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                onClick={() => navigate(transformation.path)}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Spicy Rice', cursive",
                    mb: "0.5rem",
                  }}
                >
                  {transformation.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    fontFamily: "'Josefin Sans', sans-serif",
                  }}
                >
                  {transformation.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          height: { xs: "10vh", sm: "05vh", md: "10vh" },
        }}
      />

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

export default Transformations;
