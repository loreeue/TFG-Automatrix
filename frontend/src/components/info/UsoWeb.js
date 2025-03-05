import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const UsoWeb = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "#1A1A1A",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2.0rem",
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
        ¿Cómo usar la web?
      </Typography>

      {/* Principal Container */}
      <Paper
        elevation={4}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: "#FFFFFF",
          maxWidth: "800px",
          width: "100%",
          borderRadius: "16px",
          padding: "1rem",
          fontFamily: "'Josefin Sans', sans-serif",
          animation: "fadeSlideIn 0.8s ease-out",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.75rem",
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          Instalación de JFLAP
        </Typography>
        <Typography paragraph sx={{ marginBottom: "0.75rem" }}>
          Para usar esta web puedes descargar JFLAP en el siguiente enlace:{" "}
          <a
            href="https://www.jflap.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.palette.primary.main, textDecoration: "none", fontWeight: "bold" }}
          >
            JFLAP.org
          </a>
          . JFLAP es una herramienta que permite diseñar y probar autómatas y gramáticas de forma visual.
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.75rem",
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          ¿Qué puedes hacer con esta web?
        </Typography>
        <List dense sx={{ marginBottom: "0.5rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Subir archivos JFLAP (.jff) y trabajar con ellos." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Verificar si dos AFDs son equivalentes." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Minimizar un AFD." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Validar si un autómata reconoce una cadena de entrada." />
          </ListItem>
		  <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="..." />
          </ListItem>
        </List>

        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.75rem",
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          Formatos de archivo soportados
        </Typography>
        <Typography paragraph sx={{ marginBottom: "0.75rem" }}>
          Todos los archivos deben tener la extensión <b>.jff</b>, que es el formato de JFLAP. Puedes
          diseñar los autómatas en JFLAP, guardarlos y cargarlos en esta web sin problemas.
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.75rem",
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          Consideraciones finales
        </Typography>
        <Typography paragraph sx={{ marginBottom: 0 }}>
          La web está diseñada para facilitar el aprendizaje y análisis de los autómatas. Si tienes
          dudas o encuentras algún error, no dudes en reportarlo.
        </Typography>
      </Paper>

      {/* Animaciones */}
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

export default UsoWeb;
