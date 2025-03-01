import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const InfoMT = () => {
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
        Máquina de Turing
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
          padding: "1rem",
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
          Idea general
        </Typography>
        <Typography paragraph sx={{ marginBottom: "0.75rem" }}>
          Es el modelo más general de computación “clásica”, capaz de simular cualquier algoritmo
          que se pueda describir de manera mecánica.
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.2rem",
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          Componentes
        </Typography>
        <List dense sx={{ marginTop: 0, marginBottom: "1rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Una cinta (teóricamente infinita) con celdas donde se pueden leer y escribir símbolos." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Un cabezal de lectura/escritura que se desplaza a izquierda o derecha." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Un conjunto finito de estados (inicial, finales, etc.)." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Una función de transición que, dado el estado y el símbolo bajo el cabezal, indica qué escribir, a qué estado ir y en qué dirección moverse." />
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
          Lenguaje aceptado
        </Typography>
        <Typography paragraph sx={{ marginBottom: 0 }}>
          Es el conjunto de palabras para las que la máquina finalmente se detiene en un estado final.
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

export default InfoMT;
