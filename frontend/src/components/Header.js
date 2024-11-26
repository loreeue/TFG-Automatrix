import React from "react";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const Header = () => {
    const theme = useTheme();

    return (
        <header
            style={{
                backgroundColor: theme.palette.secondary.main,
                color: "white",
                padding: "1rem",
            }}
        >
            <nav>
                <ul style={{ display: "flex", listStyle: "none", gap: "1rem" }}>
                    <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Inicio</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;