import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TransformIcon from "@mui/icons-material/Transform";
import ValidationIcon from "@mui/icons-material/CheckCircle";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuIcon from "@mui/icons-material/Menu";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import { InputAdornment, IconButton as MUIIconButton } from "@mui/material";
import "@fontsource/abril-fatface";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Detectamos dispositivos móviles y tablet (ancho <= 1024px)
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estados de autenticación y diálogo
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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`/api/users/me?userId=${userId}`)
        .then((response) => {
          setUserName(response.data.username);
        })
        .catch((error) => {
          console.error("Error obteniendo usuario:", error);
        });
    }
  }, []);

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
    if (isLogin) {
      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("userId", data.userId);
          setUserName(data.username);
          setOpenDialog(false);
          setFailedAttempts(0);
          navigate("/");
        } else {
          setFailedAttempts((prev) => prev + 1);
          setOpenErrorDialog(true);
        }
      } catch (error) {
        console.error("Error en el login:", error);
        setOpenErrorDialog(true);
      }
    } else {
      try {
        const response = await fetch("/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: userName, email, password }),
        });
        if (response.ok) {
          const newUser = await response.json();
          localStorage.setItem("userId", newUser.id);
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
      setFailedAttempts(0);
    }
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserName("");
    navigate("/");
  };

  const menuItems = (
    <>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/gramaticas">
          <BookIcon sx={{ mr: 1 }} />
          <ListItemText primary="Gramáticas" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/afds">
          <CompareArrowsIcon sx={{ mr: 1 }} />
          <ListItemText primary="AFDs" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/transformaciones">
          <TransformIcon sx={{ mr: 1 }} />
          <ListItemText primary="Transformaciones" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/simulaciones">
          <ValidationIcon sx={{ mr: 1 }} />
          <ListItemText primary="Simulaciones" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/draw_automata">
          <AutoGraphIcon sx={{ mr: 1 }} />
          <ListItemText primary="Dibujar Autómata" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/info">
          <InfoIcon sx={{ mr: 1 }} />
          <ListItemText primary="Info" />
        </ListItemButton>
      </ListItem>
    </>
  );

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: isMobileOrTablet ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: { xs: "1rem", md: "1rem 2rem" },
        backgroundColor: theme.palette.secondary.main,
        color: "#FFFFFF",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      {isMobileOrTablet ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
          <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: "#FFFFFF" }}>
            <MenuIcon />
          </IconButton>
          <IconButton onClick={() => navigate(-1)} sx={{ color: "#FFFFFF" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box
            component="span"
            onClick={handleAutomatrixClick}
            onMouseEnter={() => setIsClicked(true)}
            onMouseLeave={() => setIsClicked(false)}
            sx={{
              fontSize: "1.5rem",
              fontFamily: "'Abril Fatface', cursive",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              transform: isClicked ? "scale(1.05)" : "scale(1)",
            }}
          >
            Automatrix
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Box
            component="span"
            onClick={handleAutomatrixClick}
            onMouseEnter={() => setIsClicked(true)}
            onMouseLeave={() => setIsClicked(false)}
            sx={{
              fontSize: "1.5rem",
              fontFamily: "'Abril Fatface', cursive",
              color: "#FFFFFF",
              marginTop: "-5px",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              transform: isClicked ? "scale(1.05)" : "scale(1)",
            }}
          >
            Automatrix
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
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
        </Box>
      )}

      {!isMobileOrTablet && (
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "nowrap" }}>
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
          />
          {userName && (
            <>
              <Button
                variant="text"
                onClick={() => navigate("/docs", { state: { userName } })}
                sx={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": { color: theme.palette.primary.main },
                  fontFamily: "'Josefin Sans', sans-serif",
                }}
              >
                Mis documentos
              </Button>
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
      )}

      <Drawer anchor="left" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setMobileMenuOpen(false)}>
		<List>{menuItems}</List>

			{userName ? (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
				<Button component={Link} to="/docs" variant="contained">
				Mis documentos
				</Button>
				<Button
				variant="contained"
				startIcon={<LogoutIcon />}
				onClick={() => {
					handleLogout();
					setMobileMenuOpen(false);
				}}
				>
				Cerrar sesión
				</Button>
			</Box>
			) : (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
				<Button variant="contained" color="primary" startIcon={<LoginIcon />} onClick={() => { handleClickOpenDialog(true); setMobileMenuOpen(false); }}>
				Iniciar sesión
				</Button>
				<Button variant="contained" color="primary" startIcon={<PersonAddIcon />} onClick={() => { handleClickOpenDialog(false); setMobileMenuOpen(false); }}>
				Registrarse
				</Button>
			</Box>
			)}
        </Box>
      </Drawer>

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
                "& .MuiInputLabel-root": { fontFamily: "'Josefin Sans', sans-serif" },
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
              "& .MuiInputLabel-root": { fontFamily: "'Josefin Sans', sans-serif" },
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
              setPasswordError(
                validatePassword(e.target.value)
                  ? ""
                  : "Debe tener 8 caracteres, mayúscula, minúscula, número y símbolo."
              );
            }}
            error={!!passwordError}
            helperText={passwordError}
            sx={{
              fontFamily: "'Josefin Sans', sans-serif",
              "& .MuiInputBase-input": { fontFamily: "'Josefin Sans', sans-serif" },
              "& .MuiInputLabel-root": { fontFamily: "'Josefin Sans', sans-serif" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MUIIconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </MUIIconButton>
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
                  setConfirmPasswordError(
                    validateConfirmPassword(password, e.target.value) ? "" : "Las contraseñas no coinciden."
                  );
                }}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                sx={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  "& .MuiInputBase-input": { fontFamily: "'Josefin Sans', sans-serif" },
                  "& .MuiInputLabel-root": { fontFamily: "'Josefin Sans', sans-serif" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MUIIconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </MUIIconButton>
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
              "&:hover": { backgroundColor: theme.palette.primary.main },
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
              "&:hover": { backgroundColor: theme.palette.primary.main },
            }}
          >
            {isLogin ? "Iniciar sesión" : "Registrarse"}
          </Button>
        </DialogActions>
      </Dialog>

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
