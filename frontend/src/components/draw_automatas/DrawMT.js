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
import CircularProgress from "@mui/material/CircularProgress";
import { saveAs } from 'file-saver';
import axios from "axios";

const DrawMT = () => {
    const [nodes, setNodes] = useState([]); // States
    const [transitions, setTransitions] = useState([]); // Transitions
    const [selectedNode, setSelectedNode] = useState(null); // Selected node to create transition

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
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const [inputString, setInputString] = useState("");
	const [validationResult, setValidationResult] = useState("");
	const [loading, setLoading] = useState(false);

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
        const read = transitionRead.trim() || ".";   // If it is empty, we use "."
        const write = transitionWrite.trim() || "."; // If it is empty, we use "."
        const move = transitionMove.trim();          // 'R' o 'L'

        if (!["R", "L"].includes(move)) {
            toast.error("Movimiento inválido. Debe ser 'R' o 'L'.");
            return;
        }

        setTransitions((prevTransitions) => {
            // 1) Check if the transition exists (same 'from' and 'to')
            const existingTransitionIndex = prevTransitions.findIndex(
                (t) =>
                    t.from.id === transitionNodes.from.id &&
                    t.to.id === transitionNodes.to.id
            );

            if (existingTransitionIndex !== -1) {
                // 2) If it exists, we check its transitionsData
                const updatedTransitions = [...prevTransitions];
                const existingTransition = updatedTransitions[existingTransitionIndex];

                const transitionsData = existingTransition.transitionsData || [];

                // 3) Check if the tuple { read, write, move } already exists
                const isDuplicate = transitionsData.some(
                    (data) =>
                        data.read === read &&
                        data.write === write &&
                        data.move === move
                );

                if (isDuplicate) {
                    // 4) Show error and add nothing
                    toast.error(
                        `Ya existe una transición con (read: ${read}, write: ${write}, move: ${move}).`
                    );
                    return updatedTransitions;
                }

                // 5) We add the tuple if there is no duplicate
                updatedTransitions[existingTransitionIndex] = {
                    ...existingTransition,
                    transitionsData: [
                        ...transitionsData,
                        { read, write, move },
                    ],
                };
                return updatedTransitions;
            } else {
                // If the transition does not exist, we create a new one
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

        setShowTransitionModal(false);
        setTransitionRead("");
        setTransitionWrite("");
        setTransitionMove("");
        setTransitionNodes({ from: null, to: null });
    };

    // Handle right click to mark start/end (with modal)
    const handleContextMenu = (e, node) => {
        e.evt.preventDefault();
        setTargetNode(node);
        setShowStateTypeModal(true);
    };

    // Assign status type (Initial/End)
    const setStateType = (type) => {
        if (!targetNode) {
            toast.error("No se puede asignar un tipo de estado porque no hay un nodo seleccionado.");
            setShowStateTypeModal(false);
            return;
        }

        if (type === "initial") {
            // Check if an initial state already exists
            const existingInitial = nodes.find((node) => node.isInitial);
            if (existingInitial && existingInitial.id !== targetNode.id) {
                // If there is already a different initial state, uncheck it
                setNodes((prevNodes) =>
                    prevNodes.map((n) =>
                        n.id === existingInitial.id
                            ? { ...n, isInitial: false }
                            : n
                    )
                );
            }
        }

        // Update the selected state as initial or final
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

    // Handle clicks on states to create transitions
    const handleNodeClick = (node) => {
        if (deleteTransitionMode)
            return ;
        if (selectedNode) {
            // We select the second state
            setTransitionNodes({ from: selectedNode, to: node });
            setShowTransitionModal(true);
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

	const handleValidateStringMT = async () => {
		if (nodes.length === 0 && transitions.length === 0) {
			toast.error("No hay una Máquina de Turing para validar.");
			return;
		}

		if (!inputString) {
			toast.error("Por favor ingresa una cadena para validar.");
			return;
		}

		const xmlHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`;
		const structureOpen = `<structure>\n<type>turing</type>\n<automaton>\n`;
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
			const fromIndex = parseInt(t.from.id.replace("state-", ""), 10);
			const toIndex = parseInt(t.to.id.replace("state-", ""), 10);

			if (!t.transitionsData || t.transitionsData.length === 0) {
				console.warn(`Transición inválida o sin datos: ${JSON.stringify(t)}`);
				return "";
			}

			return t.transitionsData.map(({ read, write, move }) => {
				const readTag = !read || read.trim() === "." || read.trim() === "" ? "<read/>" : `<read>${read.trim()}</read>`;
				const writeTag = !write || write.trim() === "." || write.trim() === "" ? "<write/>" : `<write>${write.trim()}</write>`;
				const moveTag = move ? `<move>${move.trim()}</move>` : "<move/>";

				return `
		<transition>
			<from>${fromIndex}</from>
			<to>${toIndex}</to>
			${readTag}
			${writeTag}
			${moveTag}
		</transition>`;
			}).join("\n");

		}).filter(Boolean).join("\n");

		const fullXML = `${xmlHeader}
			${structureOpen}
			${statesXML}
			${transitionsXML}
			${structureClose}`;

		const blob = new Blob([fullXML], { type: "application/xml;charset=utf-8" });
		const file = new File([blob], "automata_mt.jff", { type: "application/xml" });

		// Obtain the userId from localStorage
		const userId = localStorage.getItem("userId");
		if (!userId) {
			toast.error("Error: No se encontró el ID del usuario. Inicia sesión de nuevo.", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("input", inputString);

		try {
			const response = await axios.post(`/api/validate/turingMachine?userId=${userId}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			const accepted = response.data;
			setValidationResult(
				accepted ? "La MT SÍ reconoce esta cadena." : "La MT NO reconoce esta cadena."
			);
		} catch (error) {
			console.error(error);
			toast.error("Error en el servidor al validar la cadena.");
		} finally {
			setLoading(false);
		}
	};

    const renderTransition = (t, index) => {
        if (!t || !t.from || !t.to) return null;

        const isLoop = t.from.id === t.to.id;

        // Generate the text by combining all the transitions in transitionsData
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
            // Calculate if there is an opposite transition
            const hasOppositeTransition = transitions.some(
                (other) =>
                    other.from.id === t.to.id &&
                    other.to.id === t.from.id
            );

            // Normal transition
            const dx = t.to.x - t.from.x;
            const dy = t.to.y - t.from.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const shortenBy = 30;

            // Offset to separate arrows in opposite directions
            const offsetX = hasOppositeTransition ? dy / distance * 14 : 0;
            const offsetY = hasOppositeTransition ? -dx / distance * 14 : 0;

            // Calculate the new points to shorten the arrow
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
		const structureOpen = `<structure>\n<type>turing</type>\n<automaton>\n`;
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
				return "";
			}

			return t.transitionsData.map(({ read, write, move }) => {
				const readTag = (read && read.trim() === ".") ? "<read/>" : `<read>${read || "."}</read>`;
				const writeTag = (write && write.trim() === ".") ? "<write/>" : `<write>${write || ""}</write>`;
				const moveTag = ["R", "L"].includes(move) ? move : "S";

				return `
		<transition>
			<from>${fromIndex}</from>
			<to>${toIndex}</to>
			${readTag}
			${writeTag}
			<move>${moveTag}</move>
		</transition>`;
			}).join("\n");
		}).filter(Boolean).join("\n");

		const fullXML = `${xmlHeader}
			${structureOpen}
			${statesXML}
			${transitionsXML}
			${structureClose}`;

		const blob = new Blob([fullXML], { type: "application/xml;charset=utf-8" });
		saveAs(blob, `${exportFilename || "turing_machine"}.jff`);

		setShowExportModal(false);
		setExportFilename("turing_machine");
	};

    const handleDeleteModeClick = () => {
		setDeleteTransitionMode(!deleteTransitionMode);
		if (!deleteTransitionMode) {
			toast.info("Modo de eliminación activado. Haz clic en una transición o en el nombre de un estado para eliminarlo.");
		} else {
			toast.info("Modo de eliminación desactivado.");
		}
	};

	const handleTransitionClick = (transition) => {
		if (deleteTransitionMode) {
			setTransitions(prevTransitions => prevTransitions.filter(t => t !== transition));
			toast.success("Transición eliminada.");
		}
	};

	const handleStateClick = (state) => {
		if (deleteTransitionMode) {
			setNodes(prevNodes => prevNodes.filter(n => n.id !== state.id));
			setTransitions(prevTransitions => prevTransitions.filter(t => t.from.id !== state.id && t.to.id !== state.id));
			toast.success("Estado eliminado.");
		}
	};

    return (
        <Box
            sx={{
                backgroundColor: "#1A1A1A",
                minHeight: "105vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem"
            }}>
            <ToastContainer />
            <Typography variant="h3" sx={{ fontFamily: "'Spicy Rice', cursive", color: "#FFFFFF", marginBottom: "1rem" }}>Editor de MT</Typography>
            <Box sx={{ width: "80%", height: "470px", border: "2px solid #ccc", backgroundColor: "#FFFFFF", borderRadius: "8px", position: "relative" }}>
                <Stage width={window.innerWidth * 0.75} height={500} onDblClick={addNode} style={{ cursor: "pointer" }}>
                    <Layer>
                        {transitions.map((t, index) => renderTransition(t, index))}
                        {nodes.map((node) => (
							<React.Fragment key={node.id}>
								{node.isInitial && (
									<Arrow
										points={[node.x - 70, node.y, node.x - 40, node.y]}
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
									onDragMove={(e) => moveNode(node.id, e.target.x(), e.target.y())}
									onClick={() => handleNodeClick(node)}
									onContextMenu={(e) => handleContextMenu(e, node)}
								/>
								{node.isFinal && (
									<Circle x={node.x} y={node.y} radius={34} stroke="#333" strokeWidth={2} listening={false} />
								)}
								<Text
									text={node.label}
									x={node.x - 10}
									y={node.y - 10}
									fontSize={16}
									fill="#FFFFFF"
									fontFamily="'Spicy Rice', cursive"
									onClick={() => handleStateClick(node)}
								/>
							</React.Fragment>
						))}
                    </Layer>
                </Stage>
            </Box>

            {/* Help button */}
            <Tooltip title="¿Cómo usar el editor?" placement="left">
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        right: { xs: "0.5rem", sm: "1.0rem" },
                        top: "15rem",
                        borderRadius: "50%",
                        minWidth: "3rem",
                        height: "3rem",
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": { backgroundColor: theme.palette.primary.main },
                    }}
                    onClick={() => setShowHelpModal(true)}
                >
                    <HelpOutlineIcon />
                </Button>
            </Tooltip>

            {/* Delete button */}
            <Tooltip title="Eliminar todo" placement="left">
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        right: { xs: "0.5rem", sm: "1.0rem" },
                        top: "20rem",
                        borderRadius: "50%",
                        minWidth: "3rem",
                        height: "3rem",
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": { backgroundColor: theme.palette.primary.main },
                    }}
                    onClick={() => setShowDeleteConfirmation(true)}
                >
                    <DeleteOutlineIcon />
                </Button>
            </Tooltip>

            {/* Export button */}
            <Tooltip title="Exportar como JFF" placement="left">
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        right: { xs: "0.5rem", sm: "1.0rem" },
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

            {/* Delete transition or state button */}
			<Tooltip title="Eliminar estado o transición" placement="left">
			<Button
				variant="contained"
				sx={{
				position: "absolute",
				right: { xs: "0.5rem", sm: "1.0rem" },
				top: "30rem",
				borderRadius: "50%",
				minWidth: "3rem",
				height: "3rem",
				backgroundColor: deleteTransitionMode
					? theme.palette.error.main        // rojo cuando el modo está activo
					: theme.palette.secondary.main,   // color normal cuando está inactivo
				"&:hover": {
					backgroundColor: deleteTransitionMode
					? theme.palette.error.dark      // rojo oscuro al pasar el ratón
					: theme.palette.primary.main,   // color normal al pasar el ratón
				},
				}}
				onClick={handleDeleteModeClick}
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

            {/* Modal for help */}
            <Dialog
                open={showHelpModal}
                onClose={() => setShowHelpModal(false)}
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
								flecha para eliminar la transición o en el nombre de un estado para borrar el estado.
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
                        onClick={() => setShowHelpModal(false)}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal of confirmation of delete everything */}
            <Dialog open={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <DialogTitle sx={{ fontFamily: "'Spicy Rice', cursive", textAlign: 'center' }}>
                    ¿Está seguro de querer eliminarlo todo?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: "'Josefin Sans', sans-serif" }}>
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                        onClick={() => setShowDeleteConfirmation(false)}
                    >
                        No
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': { backgroundColor: theme.palette.primary.main },
                            fontFamily: "'Josefin Sans', sans-serif",
                        }}
                        onClick={() => {
                            setNodes([]);
                            setTransitions([]);
                            setSelectedNode(null);
                            setTransitionNodes({ from: null, to: null });
                            toast.info("Todos los estados y transiciones han sido eliminados.");
                            setShowDeleteConfirmation(false);
                        }}
                    >
                        Sí
                    </Button>
                </DialogActions>
            </Dialog>
			<Box sx={{ marginTop: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: { xs: "wrap", sm: "nowrap" },  }}>
				<Typography variant="h6" sx={{ color: "#FFFFFF", fontFamily: "'Josefin Sans', sans-serif" }}>
					Validar Cadena:
				</Typography>
				<TextField
					variant="outlined"
					value={inputString}
					onChange={(e) => setInputString(e.target.value)}
					sx={{
						backgroundColor: "#FFFFFF",
						borderRadius: "8px",
						width: "250px",
						height: "30px",
						fontFamily: "'Josefin Sans', sans-serif",
						"& .MuiInputBase-input": {
							fontFamily: "'Josefin Sans', sans-serif",
							padding: "5px",
							height: "20px"
						}
					}}
					placeholder="Introduce una cadena"
				/>
				<Button
					variant="contained"
					sx={{
						backgroundColor: theme.palette.secondary.main,
						fontFamily: "'Josefin Sans', sans-serif",
						"&:hover": { backgroundColor: theme.palette.primary.main }
					}}
					onClick={handleValidateStringMT}
					disabled={loading}
				>
					{loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Validar"}
				</Button>
				{validationResult && (
					<>
						<Typography variant="h6" sx={{ color: "#FFFFFF", fontFamily: "'Josefin Sans', sans-serif" }}>
							→
						</Typography>
						<Typography variant="h6" sx={{ color: "#FFFFFF", fontFamily: "'Josefin Sans', sans-serif" }}>
							{validationResult}
						</Typography>
					</>
				)}
			</Box>
        </Box>
    );
};

export default DrawMT;
