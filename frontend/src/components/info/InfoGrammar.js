import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const InfoGrammar = () => {
  const theme = useTheme();

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
        Gramáticas y Jerarquía de Chomsky
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
          padding: "0.5rem",
          fontFamily: "'Josefin Sans', sans-serif",
          animation: "fadeSlideIn 0.8s ease-out",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.5rem",
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          Gramática formal
        </Typography>
        <Typography paragraph sx={{ marginBottom: "0.75rem" }}>
          Un sistema de producción que describe cómo formar cadenas a partir de reglas de sustitución.
          Se suelen denotar como G = (ΣN, ΣT, S, P):
        </Typography>
        <List dense sx={{ marginTop: 0, marginBottom: "1rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem", mt: "-0.2rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="ΣN: Conjunto de no terminales (variables)." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="ΣT: Conjunto de terminales." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="S: Símbolo inicial (axioma)." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="P: Conjunto finito de producciones (reglas de la forma parte izquierda → parte derecha)." />
          </ListItem>
        </List>

        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.5rem",
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          Jerarquía de Chomsky
        </Typography>
        <Typography paragraph sx={{ marginBottom: "0.75rem" }}>
          Ordenadas desde lo más restringido a lo más general:
        </Typography>
        <List dense sx={{ marginTop: 0, marginBottom: 0 }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem", mt: "-0.2rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tipo 3: Gramáticas regulares (describen lenguajes regulares)."
            />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tipo 2: Gramáticas independientes del contexto (lenguajes independientes del contexto)."
            />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tipo 1: Lenguajes sensibles al contexto."
            />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText
              primary="Tipo 0: Lenguajes recursivamente enumerables (todos los posibles que describe una MT)."
            />
          </ListItem>
        </List>
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

export default InfoGrammar;
