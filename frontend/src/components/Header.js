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
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import { InputAdornment, IconButton } from "@mui/material";
import "@fontsource/abril-fatface";

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isClicked, setIsClicked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [failedAttempts, setFailedAttempts] = useState(0);

    const handleAutomatrixClick = () => {
        setIsClicked(true);
        setTimeout(() => {
            setIsClicked(false);
            navigate("/");
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

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password) => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return passwordRegex.test(password);
	};

	const validateConfirmPassword = (password, confirmPassword) => {
		return password === confirmPassword;
	};

    const handleAuthenticate = async () => {
		if (!validateEmail(email)) {
			setEmailError("Correo no válido");
			return;
		}

		if (!validatePassword(password)) {
			setPasswordError("Debe tener 8 caracteres, mayúscula, minúscula, número y símbolo.");
			return;
		}

		if (!isLogin && !validateConfirmPassword(password, confirmPassword)) {
			setConfirmPasswordError("Las contraseñas no coinciden.");
			return;
		}

		// If everything is valid, proceed with authentication
		if (isLogin) {
			try {
				const response = await fetch("http://localhost:8080/api/users/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});

				if (response.ok) {
					const data = await response.json();
					setUserName(data.username);
					setOpenDialog(false);
					setFailedAttempts(0);
					navigate("/");
				} else {
					setFailedAttempts(prev => prev + 1);
					setOpenErrorDialog(true);
				}

			} catch (error) {
				console.error("Error en el login:", error);
				setOpenErrorDialog(true);
			}
		} else {
			try {
				const response = await fetch("http://localhost:8080/api/users/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
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
		if (failedAttempts >= 3) {
			setFailedAttempts(0); // Reinicia el contador después de mostrar el mensaje
		}
		navigate("/");
	};

    const handleLogout = () => {
        setUserName("");
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
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span
                    onClick={handleAutomatrixClick}
                    onMouseEnter={() => setIsClicked(true)}
                    onMouseLeave={() => setIsClicked(false)}
                    style={{
                        fontSize: "1.5rem",
                        fontFamily: "'Abril Fatface', cursive",
                        color: "#FFFFFF",
                        marginTop: "-5px",
                        display: "inline-block",
                        cursor: "pointer",
                        transition: "transform 0.3s ease-in-out",
                        transform: isClicked ? "scale(1.05)" : "scale(1)",
                    }}
                >
                    Automatrix
                </span>

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
                        fontFamily: "'Josefin Sans', sans-serif",
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
                        fontFamily: "'Josefin Sans', sans-serif",
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
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Transformaciones
                </Button>
                <Button
                    variant="text"
                    component={Link}
                    to="/simulaciones"
                    startIcon={<ValidationIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Simulaciones
                </Button>

                {/* DRAW AUTOMATA BUTTON */}
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
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Dibujar Autómata
                </Button>

                {/* INFO BUTTON */}
                <Button
                    variant="text"
                    component={Link}
                    to="/info"
                    startIcon={<InfoIcon />}
                    sx={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        "&:hover": { color: theme.palette.primary.main },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                >
                    Info
                </Button>
            </Box>

            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        color: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": {
                            borderColor: theme.palette.secondary.main,
                            color: theme.palette.primary.main,
                        },
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}
                    onClick={() => navigate(-1)}
                ></Button>

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
                        />
                    </>
                )}

                {!userName && (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<LoginIcon />}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                fontWeight: "bold",
                                textTransform: "none",
                                "&:hover": { backgroundColor: theme.palette.secondary.main },
                                fontFamily: "'Josefin Sans', sans-serif",
                            }}
                            onClick={() => handleClickOpenDialog(true)}
                        >
                            Iniciar sesión
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PersonAddIcon />}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                fontWeight: "bold",
                                textTransform: "none",
                                "&:hover": { backgroundColor: theme.palette.secondary.main },
                                fontFamily: "'Josefin Sans', sans-serif",
                            }}
                            onClick={() => handleClickOpenDialog(false)}
                        >
                            Registrarse
                        </Button>
                    </>
                )}
            </Box>

            {/* Login/registration pop-up*/}
            <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ "& .MuiDialog-paper": { padding: "20px", borderRadius: "10px" } }}>
				<DialogTitle sx={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "1.5rem", fontWeight: "bold" }}>
					{isLogin ? "Iniciar sesión" : "Registrarse"}
				</DialogTitle>
				<DialogContent>
					{!isLogin && (
						<TextField
							autoFocus
							margin="dense"
							label="Nombre de usuario"
							type="text"
							fullWidth
							variant="standard"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							sx={{
								fontFamily: "'Josefin Sans', sans-serif",
								"& .MuiInputBase-input": { fontFamily: "'Josefin Sans', sans-serif" },
								"& .MuiInputLabel-root": { fontFamily: "'Josefin Sans', sans-serif" }
							}}
						/>
					)}
					<TextField
						margin="dense"
						label="Correo"
						type="email"
						fullWidth
						variant="standard"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setEmailError(validateEmail(e.target.value) ? "" : "Correo no válido");
						}}
						error={!!emailError}
						helperText={emailError}
						sx={{
							fontFamily: "'Josefin Sans', sans-serif",
							"& .MuiInputBase-input": { fontFamily: "'Josefin Sans', sans-serif" },
							"& .MuiInputLabel-root": { fontFamily: "'Josefin Sans', sans-serif" }
						}}
					/>
					<TextField
						margin="dense"
						label="Contraseña"
						type={showPassword ? "text" : "password"}
						fullWidth
						variant="standard"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setPasswordError(validatePassword(e.target.value) ? "" :
								"Debe tener 8 caracteres, mayúscula, minúscula, número y símbolo.");
						}}
						error={!!passwordError}
						helperText={passwordError}
						sx={{
							fontFamily: "'Josefin Sans', sans-serif",
							"& .MuiInputBase-input": { fontFamily: "'Josefin Sans', sans-serif" },
							"& .MuiInputLabel-root": { fontFamily: "'Josefin Sans', sans-serif" }
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					{!isLogin && (
						<>
							<TextField
								margin="dense"
								label="Repetir contraseña"
								type={showPassword ? "text" : "password"}
								fullWidth
								variant="standard"
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									setConfirmPasswordError(validateConfirmPassword(password, e.target.value) ? "" : "Las contraseñas no coinciden.");
								}}
								error={!!confirmPasswordError}
								helperText={confirmPasswordError}
								sx={{
									fontFamily: "'Josefin Sans', sans-serif",
									"& .MuiInputBase-input": { fontFamily: "'Josefin Sans', sans-serif" },
									"& .MuiInputLabel-root": { fontFamily: "'Josefin Sans', sans-serif" }
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</>
					)}

				</DialogContent>
				<DialogActions sx={{ justifyContent: "space-between", padding: "16px" }}>
					<Button
						onClick={handleCloseDialog}
						variant="contained"
						color="secondary"
						sx={{
							fontFamily: "'Josefin Sans', sans-serif",
							fontWeight: "bold",
							textTransform: "none",
							borderRadius: "8px",
							transition: "0.3s",
							"&:hover": { backgroundColor: theme.palette.primary.main }
						}}
					>
						Cancelar
					</Button>
					<Button
						onClick={handleAuthenticate}
						variant="contained"
						color="secondary"
						sx={{
							fontFamily: "'Josefin Sans', sans-serif",
							fontWeight: "bold",
							textTransform: "none",
							borderRadius: "8px",
							transition: "0.3s",
							"&:hover": { backgroundColor: theme.palette.primary.main }
						}}
					>
						{isLogin ? "Iniciar sesión" : "Registrarse"}
					</Button>
				</DialogActions>
			</Dialog>

            {/* Login error pop-up */}
            <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
				<DialogTitle>Error</DialogTitle>
				<DialogContent>
					<p>El correo o la contraseña son incorrectos.</p>
					{failedAttempts >= 3 && (
						<p style={{ color: "red", fontWeight: "bold" }}>
							Ponte en contacto con el administrador para recuperar la contraseña.
						</p>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseErrorDialog}>Aceptar</Button>
				</DialogActions>
			</Dialog>
        </Box>
    );
};

export default Header;
