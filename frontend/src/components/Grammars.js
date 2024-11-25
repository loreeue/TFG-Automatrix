import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Grammars = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gramáticas
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/equivalent-grammars")}
            >
                Gramáticas Equivalentes
            </Button>
        </Box>
    );
};

export default Grammars;