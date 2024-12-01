import React from "react";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <header
            style={{
                backgroundColor: theme.palette.secondary.main,
                color: "white",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Button
                variant="outlined"
                style={{
                    color: "white",
                    borderColor: "white",
                }}
                component={Link}
                to="/"
            >
                Inicio
            </Button>
            <Button
                variant="outlined"
                style={{
                    color: "white",
                    borderColor: "white",
                }}
                onClick={() => navigate(-1)}
            >
                Atrás
            </Button>
        </header>
    );
};

export default Header;