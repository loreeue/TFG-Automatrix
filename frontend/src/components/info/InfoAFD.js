import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const InfoAFD = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "#1A1A1A",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2.0rem", // Reducir padding general un poco
        color: "#FFFFFF",
      }}
    >
      {/* Título principal */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1.5rem", // Disminuye el bottom margin
          fontFamily: "'Spicy Rice', cursive",
          animation: "fadeSlideIn 0.8s ease-out",
        }}
      >
        AFD (Autómata Finito Determinista)
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
          padding: "1rem", // menos padding para acercar el contenido
          fontFamily: "'Josefin Sans', sans-serif",
          animation: "fadeSlideIn 0.8s ease-out",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: "0.75rem", // aún menos espacio
            fontFamily: "'Spicy Rice', cursive",
            transition: "color 0.3s",
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          Idea general
        </Typography>
        <Typography
          paragraph
          sx={{
            marginBottom: "0.75rem", // controla el espaciado de párrafos
          }}
        >
          Un AFD es un modelo matemático que procesa cadenas (palabras) símbolo a símbolo, avanzando
          de forma determinista por sus estados.
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
          Componentes
        </Typography>
        <List dense sx={{ marginBottom: "1rem" }}>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Un conjunto finito de estados (uno es el inicial y puede haber varios finales)." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Un alfabeto de entrada (símbolos que puede leer)." />
          </ListItem>
          <ListItem disableGutters sx={{ marginLeft: "1rem" }}>
            <ListItemIcon sx={{ minWidth: "30px", color: "#FFFFFF" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary="Una función de transición que, dada la combinación de estado y símbolo, indica exactamente un único estado siguiente." />
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
          Aceptación de una palabra
        </Typography>
        <Typography
          paragraph
          sx={{
            marginBottom: "0.75rem",
          }}
        >
          La palabra se acepta si, al terminar de leer todos sus símbolos, el AFD se encuentra en
          un estado final.
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
          Lenguaje reconocido
        </Typography>
        <Typography paragraph sx={{ marginBottom: 0 }}>
          El conjunto de todas las palabras que el AFD acepta se denomina su lenguaje reconocido.
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

export default InfoAFD;
