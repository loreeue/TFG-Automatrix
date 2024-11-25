import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

const theme = createTheme({
    palette: {
        primary: {
            main: purple[500], // Color lila principal
        },
        secondary: {
            main: purple[300], // Color lila claro
        },
    },
});

export default theme;