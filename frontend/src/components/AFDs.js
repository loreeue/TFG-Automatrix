import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

const AFDs = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                AFDs
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Button variant="contained" color="primary">
                        AFD → AFD mínimo
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary">
                        Si dos AFDs son equivalentes
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AFDs;
