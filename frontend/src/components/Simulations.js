import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Simulations = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const group1 = [
    {
      label: "AFD",
      description: "Simula el comportamiento de un autómata finito determinista.",
      path: "/simulate-afd",
    },
    {
      label: "AFND",
      description: "Simula un autómata finito no determinista.",
      path: "/simulate-afnd",
    },
  ];

  const group2 = [
    {
      label: "AP",
      description: "Simula un autómata de pila con transiciones vacías.",
      path: "/simulate-ap",
    },
    {
      label: "MT",
      description: "Simula el comportamiento de una máquina de Turing.",
      path: "/simulate-mt",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#1A1A1A",
        minHeight: { xs: "110vh", md: "100vh" },
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
          mb: "3rem",
          fontFamily: "'Spicy Rice', cursive",
          animation: "slideIn 0.8s ease-out",
        }}
      >
        Simulaciones
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* First group */}
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          {group1.map((simulation, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={index}
              sx={{ animation: `slideIn 0.8s ease-out ${index * 0.2}s` }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: { xs: "1rem", md: "2rem" },
                  backgroundColor: theme.palette.secondary.main,
                  color: "#FFFFFF",
                  textAlign: "center",
                  borderRadius: "12px",
                  minHeight: { xs: "110px", md: "150px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                onClick={() => navigate(simulation.path)}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Spicy Rice', cursive",
                    mb: { xs: "0.3rem", md: "0.5rem" },
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                  }}
                >
                  {simulation.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    lineHeight: "1.5",
                    fontFamily: "'Josefin Sans', sans-serif",
                  }}
                >
                  {simulation.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Second group */}
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          {group2.map((simulation, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={index}
              sx={{ animation: `slideIn 0.8s ease-out ${index * 0.2 + 0.6}s` }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: { xs: "1rem", md: "2rem" },
                  backgroundColor: theme.palette.secondary.main,
                  color: "#FFFFFF",
                  textAlign: "center",
                  borderRadius: "12px",
                  minHeight: { xs: "110px", md: "150px" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                onClick={() => navigate(simulation.path)}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Spicy Rice', cursive",
                    mb: { xs: "0.3rem", md: "0.5rem" },
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                  }}
                >
                  {simulation.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    lineHeight: "1.5",
                    fontFamily: "'Josefin Sans', sans-serif",
                  }}
                >
                  {simulation.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

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

export default Simulations;
