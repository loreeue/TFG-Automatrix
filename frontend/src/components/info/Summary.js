import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const Summary = () => {
  const theme = useTheme();

  const hoverStyle = {
    transition: "color 0.3s",
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "#1A1A1A",
        minHeight: "100vh",
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
          marginBottom: "1.5rem",
          fontFamily: "'Spicy Rice', cursive",
          animation: "fadeSlideIn 0.8s ease-out",
        }}
      >
        Resumen
      </Typography>

      {/* Principal container */}
      <Paper
        elevation={4}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: "#FFFFFF",
          maxWidth: "800px",
          width: "100%",
          borderRadius: "16px",
          padding: "1.5rem",
          fontFamily: "'Josefin Sans', sans-serif",
          animation: "fadeSlideIn 0.8s ease-out",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Typography
          paragraph
          sx={{
            marginBottom: "1.25rem",
            ...hoverStyle,
          }}
        >
          <b>AFD y AFND</b>: Reconocen lenguajes regulares (Tipo 3) y son equivalentes en poder
          de reconocimiento.
        </Typography>

        <List dense sx={{ marginTop: 0, marginBottom: "1.25rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem", mt: "-0.2rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText
              primary="AFD: Autómata Finito Determinista"
              sx={hoverStyle}
            />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText
              primary="AFND: Autómata Finito No Determinista"
              sx={hoverStyle}
            />
          </ListItem>
        </List>

        <Typography
          paragraph
          sx={{
            marginBottom: "1.25rem",
            ...hoverStyle,
          }}
        >
          <b>AP</b>: Reconoce lenguajes independientes del contexto (Tipo 2).
        </Typography>

        <Typography
          paragraph
          sx={{
            marginBottom: "1.25rem",
            ...hoverStyle,
          }}
        >
          <b>MT</b>: Reconoce lenguajes recursivamente enumerables (Tipo 0) y representa
          el modelo más general de cómputo tradicional.
        </Typography>

        <Typography
          paragraph
          sx={{
            marginBottom: "1.25rem",
            ...hoverStyle,
          }}
        >
          <b>Gramáticas</b>: Definen lenguajes según restricciones (regulares,
          independientes del contexto, etc.).
        </Typography>

        <Typography
          paragraph
          sx={{
            marginBottom: "1.25rem",
            ...hoverStyle,
          }}
        >
          <b>Expresiones regulares</b>: Forma algebraica de describir lenguajes regulares.
        </Typography>

        <Typography paragraph sx={{ marginBottom: 0 }}>
          <br />
          Estos conceptos forman la base de la <b>Teoría de Autómatas y Lenguajes Formales</b>,
          en la que cada tipo de autómata o gramática describe una clase de lenguajes distinta
          dentro de la <b>Jerarquía de Chomsky</b>.
        </Typography>
      </Paper>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeSlideIn {
            0% {
              transform: translateY(20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Summary;
