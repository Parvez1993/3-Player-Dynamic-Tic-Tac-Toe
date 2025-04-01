import React from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useGameContext } from "./GameContext";

// Responsive styled cell component
const Cell = styled(Paper, {
  shouldForwardProp: (prop) =>
    prop !== "isHighlighted" &&
    prop !== "playerColor" &&
    prop !== "isWinningCell" &&
    prop !== "cellSize",
})<{
  playerColor?: string;
  isWinningCell?: boolean;
  cellSize: number;
}>(({ theme, playerColor, isWinningCell, cellSize }) => ({
  height: cellSize,
  width: cellSize,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  fontSize: cellSize * 0.4, // Responsive font size
  fontWeight: "bold",
  transition: "all 0.2s",
  backgroundColor: isWinningCell
    ? `${playerColor}33` || theme.palette.success.light
    : theme.palette.background.paper,
  color: playerColor || theme.palette.text.primary,
  border: isWinningCell ? `2px solid ${playerColor}` : "none",
  boxShadow: isWinningCell ? `0 0 8px ${playerColor}` : theme.shadows[3],
  "&:hover": {
    backgroundColor: isWinningCell
      ? `${playerColor}44`
      : theme.palette.action.hover,
    transform: "scale(1.05)",
  },
}));

const Gameboard: React.FC = () => {
  const {
    board,
    boardSize,
    makeMove,
    players,
    currentPlayerIndex,
    winningCells,
    gameOver,
  } = useGameContext();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Determine cell size based on screen size and board dimensions
  const getCellSize = () => {
    if (isSmallScreen) {
      // Small screens (mobile)
      return Math.min(50, 320 / boardSize); // Max width 320px divided by board size
    } else if (isMediumScreen) {
      // Medium screens (tablet)
      return Math.min(60, 500 / boardSize); // Max width 500px divided by board size
    } else {
      // Large screens (desktop)
      return Math.min(70, 600 / boardSize); // Max width 600px divided by board size
    }
  };

  const cellSize = getCellSize();

  // Check if a cell is part of the winning combination
  const isWinningCell = (row: number, col: number): boolean => {
    if (!winningCells) return false;
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      {!gameOver &&
        players.length > 0 &&
        currentPlayerIndex < players.length && (
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Current player:{" "}
            <span style={{ color: players[currentPlayerIndex].color }}>
              {players[currentPlayerIndex].name} (
              {players[currentPlayerIndex].symbol})
            </span>
          </Typography>
        )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "fit-content",
          mx: "auto",
        }}
      >
        {board && board.length > 0 ? (
          board.map((row, rowIndex) => (
            <Grid container key={`row-${rowIndex}`} spacing={1} sx={{ mb: 1 }}>
              {row.map((cell, colIndex) => (
                <Grid item key={`cell-${rowIndex}-${colIndex}`}>
                  <Cell
                    elevation={3}
                    onClick={() => !gameOver && makeMove(rowIndex, colIndex)}
                    playerColor={cell?.color}
                    isWinningCell={isWinningCell(rowIndex, colIndex)}
                    cellSize={cellSize}
                    sx={{
                      cursor: gameOver || cell !== null ? "default" : "pointer",
                      opacity:
                        gameOver && !isWinningCell(rowIndex, colIndex)
                          ? 0.7
                          : 1,
                    }}
                  >
                    {cell?.symbol || ""}
                  </Cell>
                </Grid>
              ))}
            </Grid>
          ))
        ) : (
          <Typography>Loading game board...</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Gameboard;
