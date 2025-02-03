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
import ClearIcon from "@mui/icons-material/Clear";
import { saveAs } from 'file-saver';

const DrawMT = () => {
    const [nodes, setNodes] = useState([]); // Estados
    const [transitions, setTransitions] = useState([]); // Transiciones
    const [selectedNode, setSelectedNode] = useState(null); // Nodo seleccionado para crear transición

    const [showStateTypeModal, setShowStateTypeModal] = useState(false);
    const [targetNode, setTargetNode] = useState(null);

    const [showTransitionModal, setShowTransitionModal] = useState(false);
    const [transitionNodes, setTransitionNodes] = useState({ from: null, to: null });

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFilename, setExportFilename] = useState("automata");

    const [transitionRead, setTransitionRead] = useState("");
    const [transitionWrite, setTransitionWrite] = useState("");
    const [transitionMove, setTransitionMove] = useState("");

    const [deleteTransitionMode, setDeleteTransitionMode] = useState(false);

    const [showHelpModal, setShowHelpModal] = useState(false);

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
    const confirmAddTransition = () => {
        const read = transitionRead.trim() || "λ";   // Si está vacío, usamos "λ"
        const write = transitionWrite.trim() || "λ"; // Si está vacío, usamos "λ"
        const move = transitionMove.trim();          // Debe ser 'R' o 'L'

        if (!["R", "L"].includes(move)) {
            toast.error("Movimiento inválido. Debe ser 'R' o 'L'.");
            return;
        }

        setTransitions((prevTransitions) => {
            // 1) Buscar si existe la transición (mismo 'from' y 'to')
            const existingTransitionIndex = prevTransitions.findIndex(
                (t) =>
                    t.from.id === transitionNodes.from.id &&
                    t.to.id === transitionNodes.to.id
            );

            if (existingTransitionIndex !== -1) {
                // 2) Si existe, revisamos su transitionsData
                const updatedTransitions = [...prevTransitions];
                const existingTransition = updatedTransitions[existingTransitionIndex];

                const transitionsData = existingTransition.transitionsData || [];

                // 3) Verificar si la tupla { read, write, move } ya existe
                const isDuplicate = transitionsData.some(
                    (data) =>
                        data.read === read &&
                        data.write === write &&
                        data.move === move
                );

                if (isDuplicate) {
                    // 4) Mostrar error y no agregar nada
                    toast.error(
                        `Ya existe una transición con (read: ${read}, write: ${write}, move: ${move}).`
                    );
                    return updatedTransitions; // No agregamos duplicados
                }

                // 5) Agregamos la tupla si no hay duplicado
                updatedTransitions[existingTransitionIndex] = {
                    ...existingTransition,
                    transitionsData: [
                        ...transitionsData,
                        { read, write, move },
                    ],
                };
                return updatedTransitions;
            } else {
                // Si no existe la transición, creamos una nueva
                return [
                    ...prevTransitions,
                    {
                        from: transitionNodes.from,
                        to: transitionNodes.to,
                        transitionsData: [{ read, write, move }],
                    },
                ];
            }
        });

        // Reiniciar valores de entrada
        setShowTransitionModal(false);
        setTransitionRead("");
        setTransitionWrite("");
        setTransitionMove("");
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
        if (!targetNode) {
            toast.error("No se puede asignar un tipo de estado porque no hay un nodo seleccionado.");
            setShowStateTypeModal(false);
            return;
        }

        if (type === "initial") {
            // Comprobar si ya existe un estado inicial
            const existingInitial = nodes.find((node) => node.isInitial);
            if (existingInitial && existingInitial.id !== targetNode.id) {
                // Si ya hay un estado inicial diferente, desmarcarlo
                setNodes((prevNodes) =>
                    prevNodes.map((n) =>
                        n.id === existingInitial.id
                            ? { ...n, isInitial: false }
                            : n
                    )
                );
            }
        }

        // Actualizar el estado seleccionado como inicial o final
        setNodes((prevNodes) =>
            prevNodes.map((n) =>
                n.id === targetNode.id
                    ? {
                        ...n,
                        isInitial: type === "initial" ? true : n.isInitial,
                        isFinal: type === "final" ? true : n.isFinal,
                    }
                    : n
            )
        );

        setShowStateTypeModal(false);
        setTargetNode(null);

        if (type === "initial") {
            toast.success("Estado marcado como inicial.");
        } else if (type === "final") {
            toast.success("Estado marcado como final.");
        }
    };

    // Manejar clics en los estados para crear transiciones
    const handleNodeClick = (node) => {
        if (deleteTransitionMode)
            return ;
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

    const handleTransitionMoveChange = (event) => {
        const value = event.target.value.toUpperCase();
        if (value === "R" || value === "L" || value === "") {
            setTransitionMove(value);
        } else {
            toast.error("Solo se permite 'R' o 'L' en el movimiento.");
        }
    };

    const renderTransition = (t, index) => {
        if (!t || !t.from || !t.to) return null;

        const isLoop = t.from.id === t.to.id;

        // Generar el texto combinando todas las transiciones en transitionsData
        const transitionText = t.transitionsData
            .map(({ read, write, move }) => `(${read}, ${write}, ${move})`)
            .join(", ");

        if (isLoop) {
            const x = t.from.x;
            const y = t.from.y;
            const radius = 30;
            const offset = 20;
            const points = [
                x - radius, y - offset,
                x, y - radius * 2,
                x + radius, y - offset,
            ];
            const textX = x - 10;
            const textY = y - radius * 1.5 - offset - 15;

            return (
                <React.Fragment key={index}>
                    <Arrow
                        points={points}
                        stroke="#333"
                        fill="#333"
                        tension={0.8}
                        pointerLength={10}
                        pointerWidth={10}
                        onClick={() => handleTransitionClick(t)}
                    />
                    <Text
                        text={transitionText}
                        x={textX}
                        y={textY}
                        fontSize={16}
                        fill="#000"
                        fontFamily="'Josefin Sans', sans-serif"
                    />
                </React.Fragment>
            );
        } else {
            // Calcular si hay una transición opuesta
            const hasOppositeTransition = transitions.some(
                (other) =>
                    other.from.id === t.to.id &&
                    other.to.id === t.from.id
            );

            // Transición normal
            const dx = t.to.x - t.from.x;
            const dy = t.to.y - t.from.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const shortenBy = 30;

            // Offset para separar flechas en direcciones opuestas
            const offsetX = hasOppositeTransition ? dy / distance * 14 : 0;
            const offsetY = hasOppositeTransition ? -dx / distance * 14 : 0;

            // Calcular los nuevos puntos para acortar la flecha
            const startX = t.from.x + (dx / distance) * shortenBy + offsetX;
            const startY = t.from.y + (dy / distance) * shortenBy + offsetY;
            const endX = t.to.x - (dx / distance) * shortenBy + offsetX;
            const endY = t.to.y - (dy / distance) * shortenBy + offsetY;

            const points = [startX, startY, endX, endY];
            const textX = (startX + endX) / 2 - 10;
            const textY = (startY + endY) / 2 - 20;

            return (
                <React.Fragment key={index}>
                    <Arrow
                        points={points}
                        stroke="#333"
                        fill="#333"
                        pointerLength={10}
                        pointerWidth={10}
                        tension={0}
                        onClick={() => handleTransitionClick(t)}
                    />
                    <Text
                        text={transitionText}
                        x={textX}
                        y={textY}
                        fontSize={16}
                        fill="#000"
                        fontFamily="'Josefin Sans', sans-serif"
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
        const structureOpen = `<structure>\n<type>turing</type>\n<automaton>\n`;
        const structureClose = `</automaton>\n</structure>`;

        // Construcción de estados
        const statesXML = nodes.map((node, i) => {
            return `
        <state id="${i}" name="${node.label}">
            <x>${node.x}</x>
            <y>${node.y}</y>
            ${node.isInitial ? "<initial/>" : ""}
            ${node.isFinal ? "<final/>" : ""}
        </state>`;
        }).join("\n");

        // Construcción de transiciones
        const transitionsXML = transitions.map(t => {
            const fromIndex = nodes.findIndex(n => n.id === t.from.id);
            const toIndex = nodes.findIndex(n => n.id === t.to.id);

            if (fromIndex === -1 || toIndex === -1) {
                console.warn(`Transición inválida: ${JSON.stringify(t)}`);
                return ""; // Omitir transiciones inválidas
            }

            return t.transitionsData.map(({ read, write, move }) => `
        <transition>
            <from>${fromIndex}</from>
            <to>${toIndex}</to>
            <read>${read || "λ"}</read>
            <write>${write || "λ"}</write>
            <move>${["R", "L"].includes(move) ? move : "S"}</move>
        </transition>`).join("\n");
        }).filter(Boolean).join("\n"); // Filtrar transiciones vacías

        // Construcción del archivo XML completo
        const fullXML = `${xmlHeader}
    ${structureOpen}
    ${statesXML}
    ${transitionsXML}
    ${structureClose}`;

        // Crear y guardar el archivo
        const blob = new Blob([fullXML], { type: "application/xml;charset=utf-8" });
        saveAs(blob, `${exportFilename || "turing_machine"}.jff`);

        // Reiniciar estado del modal y nombre del archivo
        setShowExportModal(false);
        setExportFilename("turing_machine");
    };

    // Eliminar transición
    const handleDeleteTransitionClick = () => {
        setDeleteTransitionMode(!deleteTransitionMode);
        if (!deleteTransitionMode) {
            toast.info("Modo de eliminación de transiciones activado. Haz clic en una transición para eliminarla.");
        } else {
            toast.info("Modo de eliminación de transiciones desactivado.");
        }
    };
    const handleTransitionClick = (transition) => {
        if (deleteTransitionMode) {
            setTransitions(prevTransitions => prevTransitions.filter(t => t !== transition));
            toast.success("Transición eliminada.");
        }
    };

    return (
        <Box sx={{ backgroundColor: "#1A1A1A", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
            <ToastContainer />
            <Typography variant="h3" sx={{ fontFamily: "'Spicy Rice', cursive", color: "#FFFFFF", marginBottom: "1rem" }}>Editor de MT</Typography>
            <Box sx={{ width: "80%", height: "500px", border: "2px solid #ccc", backgroundColor: "#FFFFFF", borderRadius: "8px", position: "relative" }}>
                <Stage width={window.innerWidth * 0.75} height={500} onDblClick={addNode} style={{ cursor: "pointer" }}>
                    <Layer>
                        {transitions.map((t, index) => renderTransition(t, index))}
                        {nodes.map((node) => (
                            <React.Fragment key={node.id}>
                                {node.isInitial && (
                                    <Arrow points={[node.x - 70, node.y, node.x - 40, node.y]} stroke="#333" fill="#333" pointerLength={10} pointerWidth={10} />
                                )}
                                <Circle
                                    x={node.x}
                                    y={node.y}
                                    radius={30}
                                    fill={getNodeFillColor(node)}
                                    stroke="#333"
                                    strokeWidth={2}
                                    draggable
                                    onDragMove={(e) => moveNode(node.id, e.target.x(), e.target.y())}
                                    onClick={() => handleNodeClick(node)}
                                    onContextMenu={(e) => handleContextMenu(e, node)}
                                />
                                {node.isFinal && (
                                    <Circle x={node.x} y={node.y} radius={34} stroke="#333" strokeWidth={2} listening={false} />
                                )}
                                <Text text={node.label} x={node.x - 10} y={node.y - 10} fontSize={16} fill="#FFFFFF" fontFamily="'Spicy Rice', cursive" />
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
                        top: "15rem",
                        borderRadius: "50%",
                        minWidth: "3rem",
                        height: "3rem",
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": { backgroundColor: theme.palette.primary.main },
                    }}
                    onClick={() => setShowHelpModal(true)} // Abre el modal
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
                        top: "20rem",
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
                        top: "25rem",
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

            {/* Botón de eliminar transición */}
            <Tooltip title="Eliminar transición" placement="left">
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        right: "1rem",
                        top: "30rem",
                        borderRadius: "50%",
                        minWidth: "3rem",
                        height: "3rem",
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": { backgroundColor: theme.palette.primary.main },
                    }}
                    onClick={handleDeleteTransitionClick}
                >
                    <ClearIcon />
                </Button>
            </Tooltip>

            <Dialog open={showStateTypeModal} onClose={() => setShowStateTypeModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>¿Cómo marcar el estado?</DialogTitle>
                <DialogContent
                    sx={{
                        textAlign: 'center',
                        fontFamily: "'Josefin Sans', sans-serif",
                    }}>Elige el tipo de estado:</DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                        onClick={() => {
                            setShowStateTypeModal(false);
                            setTargetNode(null);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                        onClick={() => setStateType("initial")}
                    >
                        Estado Inicial
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                        onClick={() => setStateType("final")}
                    >
                        Estado Final
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showTransitionModal} onClose={() => setShowTransitionModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>Nueva transición</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Símbolo a leer"
                            type="text"
                            variant="standard"
                            value={transitionRead}
                            onChange={(e) => setTransitionRead(e.target.value)}
                            sx={{
                                fontFamily: "'Josefin Sans', sans-serif",
                                "& .MuiInputBase-input": {
                                    color: "#111111",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                },
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Símbolo a escribir"
                            type="text"
                            variant="standard"
                            value={transitionWrite}
                            onChange={(e) => setTransitionWrite(e.target.value)}
                            sx={{
                                fontFamily: "'Josefin Sans', sans-serif",
                                "& .MuiInputBase-input": {
                                    color: "#111111",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                },
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Movimiento (R o L)"
                            type="text"
                            variant="standard"
                            value={transitionMove}
                            onChange={handleTransitionMoveChange}
                            error={transitionMove && transitionMove !== "R" && transitionMove !== "L"}
                            helperText={transitionMove && transitionMove !== "R" && transitionMove !== "L" ? "El valor debe ser 'R' o 'L'." : ""}
                            sx={{
                                fontFamily: "'Josefin Sans', sans-serif",
                                "& .MuiInputBase-input": {
                                    color: "#111111",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                            color: "#FFFFFF"
                        }}
                        onClick={() => setShowTransitionModal(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                            color: "#FFFFFF"
                        }}
                        onClick={confirmAddTransition}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showExportModal} onClose={() => setShowExportModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>Guardar archivo</DialogTitle>
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
                        sx={{
                            fontFamily: "'Josefin Sans', sans-serif",
                            "& .MuiInputBase-input": {
                                color: "#111111",
                                fontFamily: "'Josefin Sans', sans-serif",
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                        onClick={() => {
                            setShowExportModal(false);
                            setExportFilename("automata");
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                        onClick={exportToJFF}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para la ayuda */}
            <Dialog
                open={showHelpModal}
                onClose={() => setShowHelpModal(false)} // Cierra el modal
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: "center" }}>
                    ¿Cómo usar el editor?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1"
                                sx={{
                                    marginBottom: "1rem",
                                    fontFamily: "'Josefin Sans', sans-serif",
                                }}
                    >
                        Usa este editor para crear y editar autómatas de manera interactiva. Aquí tienes algunas
                        instrucciones:
                    </Typography>
                    <ul style={{fontFamily: "'Josefin Sans', sans-serif"}}>
                        <li>
                            <Typography variant="body1" sx={{fontFamily: "'Josefin Sans', sans-serif"}}>
                                <b>Doble clic</b> en el lienzo: Crear un nuevo estado.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" sx={{fontFamily: "'Josefin Sans', sans-serif"}}>
                                <b>Clic derecho</b> en un estado: Marcar como inicial o final.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" sx={{fontFamily: "'Josefin Sans', sans-serif"}}>
                                <b>Clic</b> en un estado y luego en otro: Crear una transición.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" sx={{fontFamily: "'Josefin Sans', sans-serif"}}>
                                <b>Clic</b> en un estado y luego en el mismo estado: Crear un loop.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" sx={{fontFamily: "'Josefin Sans', sans-serif"}}>
                                <b>Arrastrar</b> estados: Moverlos en el lienzo.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" sx={{fontFamily: "'Josefin Sans', sans-serif"}}>
                                <b>Botón de eliminar transición</b>: Activar modo de eliminación y hacer clic en una
                                flecha para eliminarla.
                            </Typography>
                        </li>
                    </ul>
                </DialogContent>
                <DialogActions sx={{justifyContent: "center"}}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            "&:hover": {backgroundColor: theme.palette.primary.main},
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                        onClick={() => setShowHelpModal(false)} // Cierra el modal
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DrawMT;