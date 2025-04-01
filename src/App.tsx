import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { GameProvider } from "./component/GameContext";
import PlayerSetup from "./component/PlayerSetup";
import Game from "./component/Game";
import BoardSizeControl from "./component/BoardSizeControl";

// Create theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

const App: React.FC = () => {
  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [initialBoardSize, setInitialBoardSize] = useState(5);
  const [initialWinCondition, setInitialWinCondition] = useState(4);

  // Handle board size change before starting the game
  const handleBoardSizeChange = (size: number) => {
    setInitialBoardSize(size);
    // Ensure win condition is not greater than board size
    if (initialWinCondition > size) {
      setInitialWinCondition(size);
    }
  };

  // Handle win condition change before starting the game
  const handleWinConditionChange = (condition: number) => {
    setInitialWinCondition(condition);
  };

  // Start the game
  const handleStartGame = () => {
    setGameStarted(true);
    setSetupComplete(true);
  };

  // Go back to player setup
  const handleBackToSetup = () => {
    setGameStarted(false);
    // Keep setupComplete as true to preserve player data
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameProvider
        initialBoardSize={initialBoardSize}
        initialWinCondition={initialWinCondition}
      >
        <Container maxWidth="md">
          {!gameStarted && (
            <>
              <BoardSizeControl
                boardSize={initialBoardSize}
                winCondition={initialWinCondition}
                onBoardSizeChange={handleBoardSizeChange}
                onWinConditionChange={handleWinConditionChange}
                setupComplete={setupComplete}
              />
              <PlayerSetup
                onStartGame={handleStartGame}
                boardSize={initialBoardSize}
                winCondition={initialWinCondition}
                setSetupComplete={setSetupComplete}
              />
            </>
          )}
          {gameStarted && <Game onBackToSetup={handleBackToSetup} />}
        </Container>
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
