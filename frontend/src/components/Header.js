import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TransformIcon from "@mui/icons-material/Transform";
import ValidationIcon from "@mui/icons-material/CheckCircle";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { useTheme } from "@mui/material/styles";

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Si es login o registro
    const [openErrorDialog, setOpenErrorDialog] = useState(false); // Error si no existe el usuario
    const [userName, setUserName] = useState(""); // Nombre del usuario en el header
    const [email, setEmail] = useState(""); // Para los campos del login/registro
    const [password, setPassword] = useState(""); // Para los campos del login/registro

    const usersDatabase = [
        { email: "test@user.com", password: "password123", name: "Test User" },
    ];

    const handleClickOpenDialog = (isLoginOption) => {
        setIsLogin(isLoginOption);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEmail("");
        setPassword("");
    };

    const handleAuthenticate = () => {
        if (isLogin) {
            const user = usersDatabase.find(
                (user) => user.email === email && user.password === password
            );

            if (user) {
                setUserName(user.name);
                navigate("/");
                setOpenDialog(false);
            } else {
                setOpenErrorDialog(true);
            }
        } else {
            usersDatabase.push({ email, password, name: userName });
            setUserName(userName);
            navigate("/");
            setOpenDialog(false);
        }
    };

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
        navigate("/");
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 2rem",
                backgroundColor: theme.palette.secondary.main,
                color: "#FFFFFF",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            }}
        >
            {/* Izquierda: Logo y botones */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FFFFFF" }}>
          Automatrix
        </span>

                {/* Botones principales */}
                <Button
                    variant="text"
                    component={Link}
                    to="/gramaticas"
                    startIcon={<BookIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    Gramáticas
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/afds"
                    startIcon={<CompareArrowsIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    AFDs
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/transformaciones"
                    startIcon={<TransformIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    Transformaciones
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/validaciones"
                    startIcon={<ValidationIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    Validaciones
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/draw_automata"
                    startIcon={<AutoGraphIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    Dibujar Autómata
                </Button>
            </Box>

            {/* Derecha: Botones adicionales (Inicio, Atrás, y Bienvenida) */}
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {/* Botón "Inicio" con el mismo estilo que el de Atrás */}
                <Button
                    variant="outlined" // Cambié el "contained" por "outlined"
                    component={Link}
                    to="/"
                    sx={{
                        color: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": { borderColor: theme.palette.secondary.main, color: theme.palette.primary.main },
                    }}
                >
                    Inicio
                </Button>

                {/* Botón "Atrás" con el mismo estilo que "Inicio" */}
                <Button
                    variant="outlined" // Cambié el "contained" por "outlined"
                    color="primary"
                    sx={{
                        color: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": { borderColor: theme.palette.secondary.main, color: theme.palette.primary.main },
                    }}
                    onClick={() => navigate(-1)}
                >
                    Atrás
                </Button>

                {/* Nombre del usuario en el header si está autenticado */}
                {userName && (
                    <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
            Bienvenid@, {userName}
          </span>
                )}

                {/* Botones de Iniciar sesión y Registrarse */}
                {!userName && (
                    <>
                        <Button
                            variant="contained" // Ambos botones con "contained" para el mismo estilo
                            color="primary"
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                fontWeight: "bold",
                                textTransform: "none",
                                "&:hover": { backgroundColor: theme.palette.secondary.main },
                            }}
                            onClick={() => handleClickOpenDialog(true)} // Iniciar sesión
                        >
                            Iniciar sesión
                        </Button>
                        <Button
                            variant="contained" // Ambos botones con "contained" para el mismo estilo
                            color="primary"
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                fontWeight: "bold",
                                textTransform: "none",
                                "&:hover": { backgroundColor: theme.palette.secondary.main },
                            }}
                            onClick={() => handleClickOpenDialog(false)} // Registro
                        >
                            Registrarse
                        </Button>
                    </>
                )}
            </Box>

            {/* Pop-up de iniciar sesión / registro */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isLogin ? "Iniciar sesión" : "Registrarse"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Correo"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Contraseña"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogin && (
                        <TextField
                            margin="dense"
                            label="Nombre"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleAuthenticate}>{isLogin ? "Iniciar sesión" : "Registrarse"}</Button>
                </DialogActions>
            </Dialog>

            {/* Pop-up de error en el inicio de sesión */}
            <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>El correo o la contraseña son incorrectos.</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorDialog}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Header;