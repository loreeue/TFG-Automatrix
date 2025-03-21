import React from "react";
import { Box, Typography, Paper} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const InfoAFND = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "#1A1A1A",
        minHeight: "100vh",
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
        AFND (Autómata Finito No Determinista)
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
            marginBottom: "0.75rem",
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
            marginBottom: "0.75rem",
          }}
        >
          Un AFND es como un AFD, pero puede tener varias transiciones posibles para la misma
          combinación de símbolo y estado (o incluso transiciones espontáneas sin consumir símbolo,
          llamadas λ-transiciones).
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
          Diferencia clave
        </Typography>
        <Typography
          paragraph
          sx={{
            marginBottom: "0.75rem",
          }}
        >
          Ante la misma situación (estado y símbolo), puede haber más de un estado al que ir o incluso
          no consumir símbolo alguno.
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
          Equivalencia con AFD
        </Typography>
        <Typography paragraph sx={{ marginBottom: 0 }}>
          En términos de poder de reconocimiento de lenguajes, AFND y AFD son equivalentes. Cualquier AFND
          se puede convertir en un AFD que reconozca el mismo lenguaje.
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

export default InfoAFND;
