import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Simulations = () => {
    const navigate = useNavigate(); // Hook para redirigir

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Validaciones
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/simulate-afd")}
                    >
                        AFD
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/simulate-afnd")}
                    >
                        AFND
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/simulate-ap")}
                    >
                        AP
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/simulate-mt")}
                    >
                        MT
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Simulations;