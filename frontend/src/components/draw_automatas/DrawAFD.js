import React, { useState } from "react";
import { Stage, Layer, Circle, Arrow, Text } from "react-konva";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const DrawAFD = () => {
    const [nodes, setNodes] = useState([]); // Guarda los estados
    const [transitions, setTransitions] = useState([]); // Guarda las transiciones
    const [selectedNode, setSelectedNode] = useState(null); // Estado seleccionado
    const theme = useTheme();

    // Agregar un nuevo estado
    const addNode = (e) => {
        const { x, y } = e.target.getStage().getPointerPosition();
        const newNode = {
            id: `state-${nodes.length}`,
            x,
            y,
            label: `q${nodes.length}`,
            isFinal: false,
            isInitial: false,
        };
        setNodes([...nodes, newNode]);
    };

    // Mover un estado y actualizar transiciones
    const moveNode = (id, x, y) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === id ? { ...node, x, y } : node))
        );
        setTransitions((prevTransitions) =>
            prevTransitions.map((t) => ({
                ...t,
                from: t.from.id === id ? { ...t.from, x, y } : t.from,
                to: t.to.id === id ? { ...t.to, x, y } : t.to,
            }))
        );
    };

    // Crear una nueva transición
    const addTransition = (fromNode, toNode) => {
        const letter = prompt("Introduce la letra para la transición:");
        if (!letter) {
            toast.error("Debes introducir una letra para la transición.");
            return;
        }
        setTransitions([...transitions, { from: fromNode, to: toNode, letter }]);
    };

    // Manejar clic derecho para marcar inicial/final
    const handleContextMenu = (e, node) => {
        e.evt.preventDefault();
        const option = window.confirm("¿Marcar como estado inicial? (Aceptar para Final)");
        setNodes((prevNodes) =>
            prevNodes.map((n) =>
                n.id === node.id
                    ? { ...n, isInitial: option, isFinal: !option }
                    : n
            )
        );
    };

    // Manejar clics en los estados
    const handleNodeClick = (node) => {
        if (selectedNode) {
            addTransition(selectedNode, node);
            setSelectedNode(null);
        } else {
            setSelectedNode(node);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#1A1A1A",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem",
            }}
        >
            {/* Toast */}
            <ToastContainer />
            {/* Título principal */}
            <Typography
                variant="h3"
                sx={{
                    fontFamily: "'Spicy Rice', cursive",
                    color: "#FFFFFF",
                    marginBottom: "1rem",
                }}
            >
                Editor de AFD
            </Typography>

            {/* Canvas */}
            <Box
                sx={{
                    width: "80%",
                    height: "500px",
                    border: "2px solid #ccc",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    position: "relative",
                }}
            >
                <Stage
                    width={window.innerWidth * 0.75}
                    height={500}
                    onDblClick={addNode}
                    style={{ cursor: "pointer" }}
                >
                    <Layer>
                        {/* Renderizar transiciones */}
                        {transitions.map((t, index) => (
                            <React.Fragment key={index}>
                                <Arrow
                                    points={[t.from.x, t.from.y, t.to.x, t.to.y]}
                                    stroke="#333"
                                    pointerLength={10}
                                    pointerWidth={10}
                                />
                                <Text
                                    text={t.letter}
                                    x={(t.from.x + t.to.x) / 2 - 10}
                                    y={(t.from.y + t.to.y) / 2 - 20} // Ajustar altura
                                    fontSize={16}
                                    fill="#000"
                                    fontFamily="'Spicy Rice', cursive"
                                />
                            </React.Fragment>
                        ))}

                        {/* Renderizar nodos */}
                        {nodes.map((node) => (
                            <React.Fragment key={node.id}>
                                {node.isInitial && (
                                    <Arrow
                                        points={[
                                            node.x - 40,
                                            node.y,
                                            node.x - 10,
                                            node.y,
                                        ]}
                                        stroke="#333"
                                        pointerLength={10}
                                        pointerWidth={10}
                                    />
                                )}
                                <Circle
                                    x={node.x}
                                    y={node.y}
                                    radius={30}
                                    fill={
                                        selectedNode === node
                                            ? "#694D75"
                                            : "#2C2C2C"
                                    }
                                    stroke="#333"
                                    strokeWidth={2}
                                    draggable
                                    onDragMove={(e) =>
                                        moveNode(node.id, e.target.x(), e.target.y())
                                    }
                                    onClick={() => handleNodeClick(node)}
                                    onContextMenu={(e) =>
                                        handleContextMenu(e, node)
                                    }
                                />
                                {node.isFinal && (
                                    <Circle
                                        x={node.x}
                                        y={node.y}
                                        radius={34}
                                        stroke="#333"
                                        strokeWidth={2}
                                    />
                                )}
                                <Text
                                    text={node.label}
                                    x={node.x - 10}
                                    y={node.y - 10}
                                    fontSize={16}
                                    fill="#FFFFFF"
                                    fontFamily="'Spicy Rice', cursive"
                                />
                            </React.Fragment>
                        ))}
                    </Layer>
                </Stage>
            </Box>

            {/* Botón de ayuda */}
            <Tooltip title="¿Cómo usar el editor?" placement="left">
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        right: "1rem",
                        top: "5rem", // Más arriba
                        borderRadius: "50%",
                        minWidth: "3rem",
                        height: "3rem",
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": { backgroundColor: "#331832" },
                    }}
                    onClick={() =>
                        toast.info(
                            "Doble clic para crear un estado.\nClic derecho en un estado para marcarlo como inicial o final.\nHaz clic en un estado y luego en otro para crear una transición."
                        )
                    }
                >
                    <HelpOutlineIcon />
                </Button>
            </Tooltip>
        </Box>
    );
};

export default DrawAFD;