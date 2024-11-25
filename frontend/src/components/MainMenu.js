import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Grid } from "@mui/material";

const MainMenu = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Menú Principal
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Button variant="contained" color="primary" component={Link} to="/gramaticas">
                        Gramáticas
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" component={Link} to="/afds">
                        AFDs
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" component={Link} to="/transformaciones">
                        Transformaciones
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" component={Link} to="/validaciones">
                        Validaciones
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainMenu;