import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

const Transformations = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Transformaciones
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Button variant="contained" color="primary">AFND → AFD</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary">GLD → AFND</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary">AFND → Expresión Regular</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary">Gramática IC → AP Vaciado</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary">AP Vaciado → Gramática IC</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary">Gramática IC → FN Chomsky</Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Transformations;
