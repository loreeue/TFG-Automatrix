import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import {useNavigate} from "react-router-dom";

const AFDs = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                AFDs
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/minimize-afd")}
                    >
                        AFD → AFD mínimo
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/equivalent-afd")}
                    >
                        AFDs Equivalentes
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AFDs;