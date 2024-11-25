import React from "react";
import { Box, Typography, Button } from "@mui/material";

const Grammars = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gramáticas
            </Typography>
            <Button variant="contained" color="primary">
                Si dos gramáticas son equivalentes
            </Button>
        </Box>
    );
};

export default Grammars;