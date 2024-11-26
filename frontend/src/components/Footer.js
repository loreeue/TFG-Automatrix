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
                padding: "1rem",
                position: "fixed",
                bottom: 0,
                width: "100%",
            }}
        >
            <p>&copy; {new Date().getFullYear()} - Automatrix. Todos los derechos reservados.</p>
            <p>
                Desarrollado con ❤️ por{" "}
                <a
                    href="https://github.com/loreeue"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "white", textDecoration: "underline" }}
                >
                    Loreto Uzquiano Esteban
                </a>
            </p>
        </footer>
    );
};

export default Footer;