import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const InfoER = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "#1A1A1A",
        minHeight: "80vh",
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
        Expresiones Regulares
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
          Definición
        </Typography>
        <Typography paragraph sx={{ marginBottom: "0.75rem" }}>
          Notación que describe <b>lenguajes regulares</b> a partir de:
        </Typography>
        <List dense sx={{ marginTop: 0, marginBottom: "1rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem", mt: "-0.2rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Símbolos básicos: ∅ (lenguaje vacío), λ (cadena vacía) y cualquier terminal a." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Operadores: unión ( + o ∪ ), concatenación y cierre de Kleene (∗)." />
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
          Ejemplos
        </Typography>
        <List dense sx={{ marginTop: 0, marginBottom: "1rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem", mt: "-0.2rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="(a + b)* describe todas las cadenas (incluida la vacía) formadas por a y b." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="a(a + b)* describe todas las cadenas de a y b que empiezan en a." />
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
          Operaciones
        </Typography>
        <List dense sx={{ marginTop: 0, marginBottom: "1rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem", mt: "-0.2rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Concat (r1r2), Unión (r1 + r2), Estrella (r1*) …" />
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
          Lenguaje descrito
        </Typography>
        <Typography paragraph sx={{ marginBottom: 0 }}>
          Conjunto de todas las palabras que “encajan” en la expresión regular; siempre es un
          <b> lenguaje regular</b>.
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

export default InfoER;
