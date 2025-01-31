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

const DrawAP = () => {
    const [nodes, setNodes] = useState([]);
    const [transitions, setTransitions] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    const [showStateTypeModal, setShowStateTypeModal] = useState(false);
    const [targetNode, setTargetNode] = useState(null);

    const [showTransitionModal, setShowTransitionModal] = useState(false);
    const [transitionLetter, setTransitionLetter] = useState("");
    const [stackSymbolConsume, setStackSymbolConsume] = useState("");
    const [stackSymbolPush, setStackSymbolPush] = useState("");
    const [transitionNodes, setTransitionNodes] = useState({ from: null, to: null });

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFilename, setExportFilename] = useState("automata");

    const [showStackSymbolModal, setShowStackSymbolModal] = useState(false);
    const [initialStackSymbol, setInitialStackSymbol] = useState("");

    const [deleteTransitionMode, setDeleteTransitionMode] = useState(false);

    const [showHelpModal, setShowHelpModal] = useState(false);

    const theme = useTheme();

    const addNode = (e) => {
        const { x, y } = e.target.getStage().getPointerPosition();
        const newNode = {
            id: `state-${nodes.length}`,
            x,
            y,
            label: `q${nodes.length}`,
            isFinal: false,
            isInitial: false,
            stackSymbol: null, // Para el símbolo de pila del estado inicial
        };
        setNodes([...nodes, newNode]);
    };

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

    const confirmAddTransition = () => {
        const letter = transitionLetter.trim() === "" ? "λ" : transitionLetter;
        const consume = stackSymbolConsume.trim() === "" ? "λ" : stackSymbolConsume;
        const push = stackSymbolPush.trim() === "" ? "λ" : stackSymbolPush;

        setTransitions((prevTransitions) => {
            const existingTransitionIndex = prevTransitions.findIndex(
                (t) =>
                    t.from.id === transitionNodes.from.id &&
                    t.to.id === transitionNodes.to.id
            );

            if (existingTransitionIndex !== -1) {
                // Ya existe una transición entre esos nodos
                const updatedTransitions = [...prevTransitions];
                const existingTransition = updatedTransitions[existingTransitionIndex];

                updatedTransitions[existingTransitionIndex] = {
                    ...existingTransition,
                    // Si no existe, inicializamos transitionsData como array vacío
                    transitionsData: [
                        ...(existingTransition.transitionsData || []),
                        { letter, consume, push },
                    ],
                };

                return updatedTransitions;
            } else {
                // Si no hay transición previa, creamos una nueva con su array transitionsData
                return [
                    ...prevTransitions,
                    {
                        from: transitionNodes.from,
                        to: transitionNodes.to,
                        transitionsData: [
                            { letter, consume, push },
                        ],
                    },
                ];
            }
        });

        setShowTransitionModal(false);
        setTransitionLetter("");
        setStackSymbolConsume("");
        setStackSymbolPush("");
        setTransitionNodes({ from: null, to: null });
    };

    const handleContextMenu = (e, node) => {
        e.evt.preventDefault();
        setTargetNode(node);
        setShowStateTypeModal(true);
    };

    const setStateType = (type) => {
        if (!targetNode) {
            toast.error("No se puede asignar un tipo de estado porque no hay un nodo seleccionado.");
            setShowStateTypeModal(false);
            return;
        }

        if (type === "initial") {
            const existingInitial = nodes.find((node) => node.isInitial);
            if (existingInitial) {
                // Si ya hay un estado inicial diferente, desmarcarlo
                setNodes((prevNodes) =>
                    prevNodes.map((n) =>
                        n.id === existingInitial.id
                            ? { ...n, isInitial: false }
                            : n
                    )
                );
            }

            // Abrir el modal para el símbolo de pila
            setShowStackSymbolModal(true);
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

        if (type === "initial") {
            toast.success("Estado marcado como inicial.");
        } else if (type === "final") {
            toast.success("Estado marcado como final.");
        }
    };

    const confirmStackSymbol = () => {
        if (initialStackSymbol.trim() === "") {
            toast.error("Debes introducir un símbolo de pila.");
            return;
        }

        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === targetNode.id
                    ? { ...node, stackSymbol: initialStackSymbol }
                    : node
            )
        );

        setShowStackSymbolModal(false);
        toast.success("Estado inicial configurado con símbolo de pila.");
    };

    const handleNodeClick = (node) => {
        if (deleteTransitionMode)
            return ;
        if (selectedNode) {
            setTransitionNodes({ from: selectedNode, to: node });
            setShowTransitionModal(true);
            setSelectedNode(null);
        } else {
            setSelectedNode(node);
        }
    };

    const renderTransition = (t, index) => {
        if (!t || !t.from || !t.to) return null;

        const isLoop = t.from.id === t.to.id;
        const transitionText = t.transitionsData?.map(({ letter, consume, push }) =>
            `(${letter}, ${consume}, ${push})`
            ).join(", ") || "";

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
                        fontFamily="'Spicy Rice', cursive"
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
            const startX = t.from.x + (dx / distance) * shortenBy  + offsetX;
            const startY = t.from.y + (dy / distance) * shortenBy  + offsetY;
            const endX = t.to.x - (dx / distance) * shortenBy  + offsetX;
            const endY = t.to.y - (dy / distance) * shortenBy  + offsetY;

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
                        fontFamily="'Spicy Rice', cursive"
                    />
                </React.Fragment>
            );
        }
    };

    const getNodeFillColor = (node) => {
        const isInTransition =
            (transitionNodes.from && transitionNodes.from.id === node.id) ||
            (transitionNodes.to && transitionNodes.to.id === node.id);

        if (selectedNode === node || isInTransition) {
            return theme.palette.secondary.main;
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
        const structureOpen = `<structure>\n<type>pda</type>\n<automaton>\n`;
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

            if (fromIndex === -1 || toIndex === -1) {
                console.warn(`Transición inválida: ${JSON.stringify(t)}`);
                return ""; // Omitir transiciones inválidas
            }

            // Construir XML para cada transición individual en transitionsData
            return t.transitionsData.map(({ letter, consume, push }) => `
        <transition>
            <from>${fromIndex}</from>
            <to>${toIndex}</to>
            <read>${letter}</read>
            <pop>${consume}</pop>
            <push>${push}</push>
        </transition>`).join("\n");
        }).filter(Boolean).join("\n"); // Filtrar transiciones vacías

        const fullXML = `${xmlHeader}
    ${structureOpen}
    ${statesXML}
    ${transitionsXML}
    ${structureClose}`;

        const blob = new Blob([fullXML], { type: "application/xml;charset=utf-8" });
        saveAs(blob, `${exportFilename || "automata"}.jff`);

        setShowExportModal(false);
        setExportFilename("automata");
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
            <Typography variant="h3" sx={{ fontFamily: "'Spicy Rice', cursive", color: "#FFFFFF", marginBottom: "1rem" }}>Editor de AP</Typography>
            <Box sx={{ width: "80%", height: "500px", border: "2px solid #ccc", backgroundColor: "#FFFFFF", borderRadius: "8px", position: "relative" }}>
                <Stage width={window.innerWidth * 0.75} height={500} onDblClick={addNode} style={{ cursor: "pointer" }}>
                    <Layer>
                        {transitions.map((t, index) => renderTransition(t, index))}
                        {nodes.map((node) => (
                            <React.Fragment key={node.id}>
                                {node.isInitial && (
                                    <Arrow points={[node.x - 70, node.y, node.x - 40, node.y]} stroke="#333" fill="#333" pointerLength={10} pointerWidth={10} />
                                )}
                                <Circle x={node.x} y={node.y} radius={30} fill={getNodeFillColor(node)} stroke="#333" strokeWidth={2} draggable onDragMove={(e) => moveNode(node.id, e.target.x(), e.target.y())} onClick={() => handleNodeClick(node)} onContextMenu={(e) => handleContextMenu(e, node)} />
                                {node.isFinal && (
                                    <Circle x={node.x} y={node.y} radius={34} stroke="#333" strokeWidth={2} listening={false} />
                                )}
                                <Text text={node.label} x={node.x - 10} y={node.y - 10} fontSize={16} fill="#FFFFFF" fontFamily="'Spicy Rice', cursive" />
                                {node.isInitial && node.stackSymbol && (
                                    <Text text={node.stackSymbol} x={node.x - 60} y={node.y - 40} fontSize={16} fill="#000" fontFamily="'Spicy Rice', cursive" />
                                )}
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
                <DialogContent sx={{ textAlign: 'center' }}>Elige el tipo de estado:</DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={() => { setShowStateTypeModal(false); setTargetNode(null); }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={() => setStateType("initial")}>
                        Estado Inicial
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={() => setStateType("final")}>
                        Estado Final
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showStackSymbolModal} onClose={() => setShowStackSymbolModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>Símbolo de pila inicial</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Símbolo de pila" type="text" fullWidth variant="standard" value={initialStackSymbol} onChange={(e) => setInitialStackSymbol(e.target.value)} sx={{ fontFamily: "'Spicy Rice', cursive" }} />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={() => setShowStackSymbolModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={confirmStackSymbol}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showTransitionModal} onClose={() => setShowTransitionModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>Nueva transición</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <TextField autoFocus margin="dense" label="Letra" type="text" variant="standard" value={transitionLetter} onChange={(e) => setTransitionLetter(e.target.value)} sx={{ fontFamily: "'Spicy Rice', cursive" }} />
                        <TextField margin="dense" label="Consume pila" type="text" variant="standard" value={stackSymbolConsume} onChange={(e) => setStackSymbolConsume(e.target.value)} sx={{ fontFamily: "'Spicy Rice', cursive" }} />
                        <TextField margin="dense" label="Introduce pila" type="text" variant="standard" value={stackSymbolPush} onChange={(e) => setStackSymbolPush(e.target.value)} sx={{ fontFamily: "'Spicy Rice', cursive" }} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={() => setShowTransitionModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={confirmAddTransition}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showExportModal} onClose={() => setShowExportModal(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>Guardar archivo</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre del archivo" type="text" fullWidth variant="standard" value={exportFilename} onChange={(e) => setExportFilename(e.target.value)} sx={{ fontFamily: "'Spicy Rice', cursive" }} />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={() => { setShowExportModal(false); setExportFilename("automata"); }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.primary.main } }} onClick={exportToJFF}>
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
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                        Usa este editor para crear y editar autómatas de manera interactiva. Aquí tienes algunas instrucciones:
                    </Typography>
                    <ul>
                        <li>
                            <Typography variant="body1">
                                <b>Doble clic</b> en el lienzo: Crear un nuevo estado.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                <b>Clic derecho</b> en un estado: Marcar como inicial o final.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                <b>Clic</b> en un estado y luego en otro: Crear una transición.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                <b>Clic</b> en un estado y luego en el mismo estado: Crear un loop.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                <b>Arrastrar</b> estados: Moverlos en el lienzo.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                <b>Botón de eliminar transición</b>: Activar modo de eliminación y hacer clic en una flecha para eliminarla.
                            </Typography>
                        </li>
                    </ul>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            "&:hover": { backgroundColor: theme.palette.primary.main },
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

export default DrawAP;