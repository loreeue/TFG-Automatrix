import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#331832", // Color principal oscuro
        },
        secondary: {
            main: "#694D75", // Color secundario más claro
        },
    },
    typography: {
        fontFamily: "'Raleway', sans-serif", // Fuente personalizada
    },
});

export default theme;