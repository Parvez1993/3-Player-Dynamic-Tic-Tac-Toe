import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Avatar,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useGameContext } from "./GameContext";
import { Player } from "../types/Players";

// Initial player data
const initialPlayers: Player[] = [
  { id: 1, name: "", symbol: "X", color: "#2196f3" },
  { id: 2, name: "", symbol: "O", color: "#f44336" },
  { id: 3, name: "", symbol: "Δ", color: "#4caf50" },
];

interface PlayerSetupProps {
  onStartGame: () => void;
  boardSize: number;
  winCondition: number;
  setSetupComplete: (value: boolean) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({
  onStartGame,
  boardSize,
  winCondition,
  setSetupComplete,
}) => {
  const { setPlayers, players: contextPlayers } = useGameContext();
  const [players, setLocalPlayers] = useState<Player[]>(initialPlayers);

  // Use existing player data if available
  useEffect(() => {
    if (contextPlayers && contextPlayers.length > 0) {
      setLocalPlayers(contextPlayers);
    }
  }, [contextPlayers]);

  // Update player name
  const handleNameChange = (id: number, name: string) => {
    setLocalPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, name } : player
      )
    );
  };

  // Check if all players have names
  const isFormValid = () => {
    return players.every((player) => player.name.trim().length > 0);
  };

  // Start the game
  const handleStartGame = () => {
    if (isFormValid()) {
      setPlayers(players);
      onStartGame();
    }
  };
  // reset the game
  const handleResetGame = () => {
    if (isFormValid()) {
      setPlayers([]);
      setSetupComplete(false);
    }
  };

  return (
    <Box sx={{ my: 4, textAlign: "center" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Tic Tac Toe ({boardSize}x{boardSize})
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 4 }}
      >
        {players.length} player game • Win with {winCondition} in a row
      </Typography>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
          Enter Player Names
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ mt: 2, mb: 4 }}
          justifyContent="center"
        >
          {players.map((player) => (
            <Paper
              key={player.id}
              elevation={3}
              sx={{
                p: 3,
                width: { xs: "100%", sm: "30%" },
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  mx: "auto",
                  mb: 2,
                  bgcolor: player.color,
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {player.symbol}
              </Avatar>
              <Typography variant="h6" align="center" gutterBottom>
                Player {player.id}
              </Typography>
              <TextField
                fullWidth
                label="Enter name"
                variant="outlined"
                value={player.name}
                onChange={(e) => handleNameChange(player.id, e.target.value)}
                sx={{ mt: 2 }}
              />
            </Paper>
          ))}
        </Stack>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={handleStartGame}
          disabled={!isFormValid()}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Start Game
        </Button>
      </Box>
    </Box>
  );
};

export default PlayerSetup;
