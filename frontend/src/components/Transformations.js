import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Transformations = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Transformaciones
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/afnd-to-afd")}
                    >
                        AFND → AFD
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/gld-to-afd")}
                    >
                        GLD → AFD
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/afd-to-er")}
                    >
                        AFD → ER
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/gic-to-ap")}
                    >
                        GIC → AP Vaciado
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/ap-to-gic")}
                    >
                        AP Vaciado → GIC
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/gic-to-chomsky")}
                    >
                        GIC → FN Chomsky
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Transformations;