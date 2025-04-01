import React from "react";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGameContext } from "./GameContext";
import GameBoard from "./Gameboard";
import ScoreBoard from "./Scoreboard";

interface GameProps {
  onBackToSetup: () => void;
}

const Game: React.FC<GameProps> = ({ onBackToSetup }) => {
  const {
    players,
    currentPlayerIndex,
    winner,
    gameOver,
    boardSize,
    winCondition,
    resetGame,
    moveCount,
  } = useGameContext();

  const totalCells = boardSize * boardSize;
  const isDraw = gameOver && !winner;

  // Handle going back to setup without losing player data
  const handleBackToSetup = () => {
    // Call the parent function to change the view
    onBackToSetup();
  };

  return (
    <Box sx={{ my: 4, textAlign: "center" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tic Tac Toe ({boardSize}x{boardSize})
      </Typography>
      <Typography variant="body1" gutterBottom color="text.secondary">
        Connect {winCondition} to win • Moves: {moveCount}/{totalCells}
      </Typography>

      <ScoreBoard players={players} currentPlayerIndex={currentPlayerIndex} />

      {/* Game status message */}
      {winner && (
        <Paper
          elevation={3}
          sx={{
            py: 2,
            px: 4,
            mb: 3,
            mt: 2,
            mx: "auto",
            maxWidth: "fit-content",
            borderLeft: `6px solid ${winner.color}`,
            backgroundColor: `${winner.color}22`,
          }}
        >
          <Typography variant="h6">
            <span style={{ color: winner.color, fontWeight: "bold" }}>
              {winner.name}
            </span>{" "}
            wins!
          </Typography>
        </Paper>
      )}

      {isDraw && (
        <Paper
          elevation={3}
          sx={{
            py: 2,
            px: 4,
            mb: 3,
            mt: 2,
            mx: "auto",
            maxWidth: "fit-content",
            borderLeft: "6px solid #9e9e9e",
            backgroundColor: "#9e9e9e22",
          }}
        >
          <Typography variant="h6">Game ends in a draw!</Typography>
        </Paper>
      )}

      <GameBoard />

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToSetup}
        >
          Change Players
        </Button>
        <Button
          variant="contained"
          startIcon={<RestartAltIcon />}
          onClick={resetGame}
        >
          Reset Game
        </Button>
      </Stack>
    </Box>
  );
};

export default Game;
