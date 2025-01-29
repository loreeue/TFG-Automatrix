import React from "react";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
    const theme = useTheme();

    return (
        <footer
            style={{
                backgroundColor: theme.palette.secondary.main,
                color: "white",
                textAlign: "center",
                padding: "0.5rem",
                position: "fixed",
                bottom: 0,
                width: "100%",
                fontFamily: "'Josefin Sans', sans-serif",
            }}
        >
            <p>&copy; {new Date().getFullYear()} - Automatrix. Todos los derechos reservados.</p>
            <p>
                Desarrollado con ❤️ por{" "}
                <a
                    href="https://github.com/loreeue"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "white",
                        textDecoration: "underline",
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Loreto Uzquiano Esteban
                </a>
            </p>
        </footer>
    );
};

export default Footer;