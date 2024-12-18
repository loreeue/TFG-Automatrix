import React, { useState } from "react";
import { Stage, Layer, Circle, Arrow, Text } from "react-konva";
import {
    Box,
    Typography,
    Button,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { saveAs } from 'file-saver';

const DrawAFD = () => {
    const [nodes, setNodes] = useState([]); // Estados
    const [transitions, setTransitions] = useState([]); // Transiciones
    const [selectedNode, setSelectedNode] = useState(null); // Nodo seleccionado para crear transición

    const [showStateTypeModal, setShowStateTypeModal] = useState(false);
    const [targetNode, setTargetNode] = useState(null);

    const [showTransitionModal, setShowTransitionModal] = useState(false);
    const [transitionLetter, setTransitionLetter] = useState("");
    const [transitionNodes, setTransitionNodes] = useState({ from: null, to: null });

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFilename, setExportFilename] = useState("automata");

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

    // Crear una nueva transición (con modal)
    const confirmAddTransition = () => {
        if (!transitionLetter) {
            toast.error("Debes introducir una letra para la transición.");
            return;
        }
        setTransitions([...transitions, { from: transitionNodes.from, to: transitionNodes.to, letter: transitionLetter }]);
        setShowTransitionModal(false);
        setTransitionLetter("");
        setTransitionNodes({ from: null, to: null });
    };

    // Manejar clic derecho para marcar inicial/final (con modal)
    const handleContextMenu = (e, node) => {
        e.evt.preventDefault();
        setTargetNode(node);
        setShowStateTypeModal(true);
    };

    // Asignar tipo de estado (Inicial/Final)
    const setStateType = (type) => {
        let isInitial = false;
        let isFinal = false;
        if (type === "initial") {
            isInitial = true;
            isFinal = false;
        } else if (type === "final") {
            isFinal = true;
            isInitial = false;
        }

        setNodes((prevNodes) =>
            prevNodes.map((n) =>
                n.id === targetNode.id
                    ? { ...n, isInitial, isFinal }
                    : n
            )
        );
        setShowStateTypeModal(false);
        setTargetNode(null);
    };

    // Manejar clics en los estados para crear transiciones
    const handleNodeClick = (node) => {
        if (selectedNode) {
            // Seleccionamos el segundo estado
            setTransitionNodes({ from: selectedNode, to: node });
            setShowTransitionModal(true);
            // No limpiamos selectedNode aquí para poder mostrar ambos resaltados mediante transitionNodes
            setSelectedNode(null);
        } else {
            setSelectedNode(node);
        }
    };

    // Dibujar transición
    const renderTransition = (t, index) => {
        const isLoop = t.from.id === t.to.id;
        if (isLoop) {
            const x = t.from.x;
            const y = t.from.y;
            // Curva de loop más vistosa: formamos un arco sobre el nodo
            // Creamos varios puntos para generar un arco suave sobre el estado
            const points = [
                x, y,
                x - 50, y - 50,
                x - 50, y - 100,
                x,     y - 110, // punto más alto del arco
                x + 50, y - 100,
                x + 50, y - 50,
                x, y
            ];

            // Texto en la parte superior de la curva (cerca del punto más alto)
            const textX = x - 10;
            const textY = y - 130;

            return (
                <React.Fragment key={index}>
                    <Arrow
                        points={points}
                        stroke="#333"
                        fill="#333"
                        pointerLength={10}
                        pointerWidth={10}
                        tension={0.8}
                    />
                    <Text
                        text={t.letter}
                        x={textX}
                        y={textY}
                        fontSize={16}
                        fill="#000"
                        fontFamily="'Spicy Rice', cursive"
                    />
                </React.Fragment>
            );
        } else {
            // Transición normal
            const points = [t.from.x, t.from.y, t.to.x, t.to.y];
            const textX = (t.from.x + t.to.x) / 2 - 10;
            const textY = (t.from.y + t.to.y) / 2 - 20;

            return (
                <React.Fragment key={index}>
                    <Arrow
                        points={points}
                        stroke="#333"
                        fill="#333"
                        pointerLength={10}
                        pointerWidth={10}
                        tension={0}
                    />
                    <Text
                        text={t.letter}
                        x={textX}
                        y={textY}
                        fontSize={16}
                        fill="#000"
                        fontFamily="'Spicy Rice', cursive"
                    />
                </React.Fragment>
            );
        }
    };

    // Función para determinar el color del estado
    const getNodeFillColor = (node) => {
        const isInTransition =
            (transitionNodes.from && transitionNodes.from.id === node.id) ||
            (transitionNodes.to && transitionNodes.to.id === node.id);

        if (selectedNode === node || isInTransition) {
            return theme.palette.secondary.main; // Morado
        }
        return "#2C2C2C";
    };

    const handleExportClick = () => {
        if (nodes.length === 0 && transitions.length === 0) {
            toast.error("No hay nada que exportar.");
            return;
        }
        setShowExportModal(true);
    };

    const exportToJFF = () => {
        const xmlHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`;
        const structureOpen = `<structure>\n<type>fa</type>\n<automaton>\n`;
        const structureClose = `</automaton>\n</structure>`;

        const statesXML = nodes.map((node, i) => {
            return `
        <state id="${i}" name="${node.label}">
            <x>${node.x}</x>
            <y>${node.y}</y>
            ${node.isInitial ? "<initial/>" : ""}
            ${node.isFinal ? "<final/>" : ""}
        </state>`;
        }).join("\n");

        const transitionsXML = transitions.map(t => {
            const fromIndex = nodes.findIndex(n => n.id === t.from.id);
            const toIndex = nodes.findIndex(n => n.id === t.to.id);

            return `
        <transition>
            <from>${fromIndex}</from>
            <to>${toIndex}</to>
            <read>${t.letter}</read>
        </transition>`;
        }).join("\n");

        const fullXML = `${xmlHeader}
        ${structureOpen}
        ${statesXML}
        ${transitionsXML}
        ${structureClose}`;

        const blob = new Blob([fullXML], {type: "application/xml;charset=utf-8"});
        saveAs(blob, `${exportFilename || "automata"}.jff`);

        setShowExportModal(false);
        setExportFilename("automata");
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
                        {transitions.map((t, index) => renderTransition(t, index))}

                        {/* Renderizar nodos */}
                        {nodes.map((node) => (
                            <React.Fragment key={node.id}>
                                {node.isInitial && (
                                    <Arrow
                                        points={[
                                            node.x - 70,
                                            node.y,
                                            node.x - 40,
                                            node.y,
                                        ]}
                                        stroke="#333"
                                        fill="#333"
                                        pointerLength={10}
                                        pointerWidth={10}
                                    />
                                )}
                                <Circle
                                    x={node.x}
                                    y={node.y}
                                    radius={30}
                                    fill={getNodeFillColor(node)}
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
                                        listening={false} // no bloquea eventos
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
                        top: "7rem",
                        borderRadius: "50%",
                        minWidth: "3rem",
                        height: "3rem",
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": { backgroundColor: theme.palette.primary.main },
                    }}
                    onClick={() =>
                        toast.info(
                            "Doble clic en el lienzo: Crear un estado.\n" +
                            "Clic derecho en un estado: Establecerlo como inicial/final.\n" +
                            "Clic en un estado y luego en otro: Crear transición.\n" +
                            "Clic en un estado y luego en el mismo estado: Crear loop.\n" +
                            "Arrastrar estados para moverlos."
                        )
                    }
                >
                    <HelpOutlineIcon />
                </Button>
            </Tooltip>

            {/* Botón de eliminar */}
            <Tooltip title="Eliminar todo" placement="left">
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        right: "1rem",
                        top: "12rem",
                        borderRadius: "50%",
                        minWidth: "3rem",
                        height: "3rem",
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": { backgroundColor: theme.palette.primary.main },
                    }}
                    onClick={() => {
                        setNodes([]);
                        setTransitions([]);
                        setSelectedNode(null);
                        setTransitionNodes({ from: null, to: null });
                        toast.info("Todos los estados y transiciones han sido eliminados.");
                    }}
                >
                    <DeleteOutlineIcon />
                </Button>
            </Tooltip>

            {/* Botón de exportar */}
            <Tooltip title="Exportar como JFF" placement="left">
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        right: "1rem",
                        top: "17rem",
                        borderRadius: "50%",
                        minWidth: "3rem",
                        height: "3rem",
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": { backgroundColor: theme.palette.primary.main },
                    }}
                    onClick={handleExportClick}
                >
                    <SaveAltIcon />
                </Button>
            </Tooltip>

            {/* Modal para marcar estado inicial/final */}
            <Dialog open={showStateTypeModal} onClose={() => setShowStateTypeModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>
                    ¿Cómo marcar el estado?
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    Elige el tipo de estado:
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }}
                        onClick={() => {
                            setShowStateTypeModal(false);
                            setTargetNode(null);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }}
                        onClick={() => setStateType("initial")}
                    >
                        Estado Inicial
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }}
                        onClick={() => setStateType("final")}
                    >
                        Estado Final
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para introducir la letra de la transición */}
            <Dialog open={showTransitionModal} onClose={() => setShowTransitionModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>
                    Introducir letra de la transición
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="transition-letter"
                        label="Letra"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={transitionLetter}
                        onChange={(e) => setTransitionLetter(e.target.value)}
                        sx={{ fontFamily: "'Spicy Rice', cursive" }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }}
                        onClick={() => {
                            setShowTransitionModal(false);
                            setTransitionLetter("");
                            setTransitionNodes({ from: null, to: null });
                            // Devolvemos el estado a normal si se cancela
                            setSelectedNode(null);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }}
                        onClick={() => {
                            confirmAddTransition();
                            setSelectedNode(null);
                        }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para el nombre del archivo al exportar */}
            <Dialog open={showExportModal} onClose={() => setShowExportModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>
                    Guardar archivo
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre del archivo"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={exportFilename}
                        onChange={(e) => setExportFilename(e.target.value)}
                        sx={{ fontFamily: "'Spicy Rice', cursive" }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }}
                        onClick={() => {
                            setShowExportModal(false);
                            setExportFilename("automata");
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }}
                        onClick={exportToJFF}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DrawAFD;