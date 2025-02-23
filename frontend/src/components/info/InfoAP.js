import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const InfoAP = () => {
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
      {/* Título principal */}
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
        AP (Autómata a Pila)
      </Typography>

      {/* Contenedor principal */}
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
        {/* Idea general */}
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
        <Typography paragraph sx={{ marginBottom: "0.4rem" }}>
          Los autómatas a pila añaden una pila como memoria auxiliar a los autómatas finitos,
          lo que les permite recordar información ilimitada (siempre que solo accedan al tope
          de la pila).
        </Typography>

        {/* Reconocen */}
        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.4rem",
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          Reconocen
        </Typography>
        <Typography paragraph sx={{ marginBottom: "0.6rem" }}>
          Lenguajes independientes del contexto (Tipo 2 en la Jerarquía de Chomsky).
        </Typography>

        {/* Componentes */}
        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.2rem", // Menos espacio justo antes de la lista
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          Componentes
        </Typography>
        <List dense sx={{ marginTop: 0, marginBottom: "0.8rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Un conjunto de estados (inicial, finales, etc.)." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Un alfabeto de entrada y un alfabeto de pila (símbolos que se apilan/desapilan)." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Una función de transición que depende tanto del símbolo leído como del símbolo en la cima de la pila." />
          </ListItem>
        </List>

        {/* Aceptación */}
        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.2rem", // Menos espacio
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          Aceptación
        </Typography>
        <Typography paragraph sx={{ marginBottom: "0.2rem" }}>
          Se puede definir de dos formas:
        </Typography>
        <List dense sx={{ marginTop: 0, marginBottom: 0 }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Por estado final: el AP acepta si, al terminar la entrada, está en un estado final (sin importar la pila)." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Por vaciado de pila: el AP acepta si, al finalizar la lectura, la pila queda vacía." />
          </ListItem>
        </List>
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

export default InfoAP;
