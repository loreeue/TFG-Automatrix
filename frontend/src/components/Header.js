import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TransformIcon from "@mui/icons-material/Transform";
import ValidationIcon from "@mui/icons-material/CheckCircle";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import { InputAdornment, IconButton } from "@mui/material";
import "@fontsource/abril-fatface";

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Si es login o registro
    const [openErrorDialog, setOpenErrorDialog] = useState(false); // Error si no existe el usuario
    const [userName, setUserName] = useState(""); // Nombre del usuario en el header
    const [email, setEmail] = useState(""); // Para los campos del login/registro
    const [password, setPassword] = useState(""); // Para los campos del login/registro
    const [isClicked, setIsClicked] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

    const handleAutomatrixClick = () => {
        setIsClicked(true);
        setTimeout(() => {
            setIsClicked(false);
            navigate("/"); // Redirige después de la animación
        }, 300);
    };

    const handleClickOpenDialog = (isLoginOption) => {
        setIsLogin(isLoginOption);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEmail("");
        setPassword("");
    };

    const handleAuthenticate = async () => {
		if (isLogin) {
			// Inicio de sesión: verifica si el usuario existe
			try {
				const response = await fetch("http://localhost:8080/api/users/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				});

				if (response.ok) {
					const data = await response.json();
					setUserName(data.username);
					setOpenDialog(false);
					navigate("/");
				} else {
					setOpenErrorDialog(true);
				}
			} catch (error) {
				console.error("Error en el login:", error);
				setOpenErrorDialog(true);
			}
		} else {
			// Registro de usuario
			try {
				const response = await fetch("http://localhost:8080/api/users/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username: userName, email, password }),
				});

				if (response.ok) {
					const newUser = await response.json();
					setUserName(newUser.username);
					setOpenDialog(false);
					navigate("/");
				} else {
					console.error("Error al crear el usuario");
				}
			} catch (error) {
				console.error("Error en el registro:", error);
			}
		}
	};

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
        navigate("/");
    };

	const handleLogout = () => {
		setUserName(""); // Elimina el mensaje de bienvenida
		navigate("/"); // Redirige al usuario a la página principal
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
            <Box sx={{display: "flex", alignItems: "center", gap: "1rem"}}>
                {/* Automatrix como Link al inicio */}
                <span
                    onClick={handleAutomatrixClick}
                    onMouseEnter={() => setIsClicked(true)}  // Cuando el mouse entra, agrandar
                    onMouseLeave={() => setIsClicked(false)} // Cuando el mouse sale, volver al tamaño normal
                    style={{
                        fontSize: "1.5rem",
                        fontFamily: "'Abril Fatface', cursive",
                        color: "#FFFFFF",
                        marginTop: "-5px",
                        display: "inline-block",
                        cursor: "pointer",
                        transition: "transform 0.3s ease-in-out",
                        transform: isClicked ? "scale(1.05)" : "scale(1)",  // Animación suave
                    }}
                >
                    Automatrix
                </span>

                {/* Botones principales */}
                <Button
                    variant="text"
                    component={Link}
                    to="/gramaticas"
                    startIcon={<BookIcon/>}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": {color: theme.palette.primary.main},
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Gramáticas
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/afds"
                    startIcon={<CompareArrowsIcon/>}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": {color: theme.palette.primary.main},
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    AFDs
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/transformaciones"
                    startIcon={<TransformIcon/>}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": {color: theme.palette.primary.main},
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Transformaciones
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/simulaciones"
                    startIcon={<ValidationIcon/>}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": {color: theme.palette.primary.main},
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Simulaciones
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/draw_automata"
                    startIcon={<AutoGraphIcon/>}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": {color: theme.palette.primary.main},
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Dibujar Autómata
                </Button>
            </Box>

            {/* Derecha: Botones adicionales */}
            <Box sx={{display: "flex", gap: "1rem", alignItems: "center"}}>
                {/* Botón "Atrás" con el mismo estilo que "Inicio" */}
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        color: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": { borderColor: theme.palette.secondary.main, color: theme.palette.primary.main },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                    onClick={() => navigate(-1)}
                ></Button>

                {/* Nombre del usuario en el header si está autenticado */}
                {userName && (
					<>
						<span style={{ fontSize: "1rem", fontWeight: "bold" }}>
							Bienvenid@, {userName}
						</span>
						<Button
							variant="contained"
							color="secondary"
							startIcon={<LogoutIcon />}
							sx={{
								fontWeight: "bold",
								textTransform: "none",
								"&:hover": { backgroundColor: theme.palette.primary.main },
								fontFamily: "'Josefin Sans', sans-serif",
							}}
							onClick={handleLogout}
						>
						</Button>
					</>
				)}

                {/* Botones de Iniciar sesión y Registrarse */}
                {!userName && (
                    <>
                        <Button
                            variant="contained" // Ambos botones con "contained" para el mismo estilo
                            color="primary"
                            startIcon={<LoginIcon />}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                fontWeight: "bold",
                                textTransform: "none",
                                "&:hover": { backgroundColor: theme.palette.secondary.main },
                                fontFamily: "'Josefin Sans', sans-serif",
                            }}
                            onClick={() => handleClickOpenDialog(true)} // Iniciar sesión
                        >
                            Iniciar sesión
                        </Button>
                        <Button
                            variant="contained" // Ambos botones con "contained" para el mismo estilo
                            color="primary"
                            startIcon={<PersonAddIcon />}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                fontWeight: "bold",
                                textTransform: "none",
                                "&:hover": { backgroundColor: theme.palette.secondary.main },
                                fontFamily: "'Josefin Sans', sans-serif",
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
						type={showPassword ? "text" : "password"} // Alterna entre text y password
						fullWidth
						variant="standard"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							)
						}}
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
