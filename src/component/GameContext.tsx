import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Player } from "../types/Players";

interface GameContextType {
  // Game configuration
  boardSize: number;
  winCondition: number;

  // Players
  players: Player[];
  currentPlayerIndex: number;

  // Game state
  board: (Player | null)[][];
  gameOver: boolean;
  winner: Player | null;
  winningCells: [number, number][];
  moveCount: number;

  // Actions
  setPlayers: (players: Player[]) => void;
  makeMove: (row: number, col: number) => void;
  resetGame: () => void;
  changeBoardSize: (size: number) => void;
  changeWinCondition: (condition: number) => void;
  startNewGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  initialBoardSize?: number;
  initialWinCondition?: number;
}

export const GameProvider: React.FC<GameProviderProps> = ({
  children,
  initialBoardSize = 5,
  initialWinCondition = 4,
}) => {
  // Game configuration
  const [boardSize, setBoardSize] = useState(initialBoardSize);
  const [winCondition, setWinCondition] = useState(initialWinCondition);

  // Players
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Game state
  const [board, setBoard] = useState<(Player | null)[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [moveCount, setMoveCount] = useState(0);

  // Initialize board when dimensions change
  useEffect(() => {
    setBoard(createEmptyBoard(boardSize));
  }, [boardSize]);

  // Update board size and win condition when props change
  useEffect(() => {
    if (initialBoardSize !== boardSize) {
      setBoardSize(initialBoardSize);
    }
    if (initialWinCondition !== winCondition) {
      setWinCondition(initialWinCondition);
    }
  }, [initialBoardSize, initialWinCondition]);

  // Helper function to create empty board
  function createEmptyBoard(size: number) {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));
  }

  // Simplified win checking function
  function checkWin(row: number, col: number, player: Player) {
    // The directions to check: horizontal, vertical, diagonal down-right, diagonal down-left
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dRow, dCol] of directions) {
      let count = 1; // Start with 1 for the current cell
      const winCells: [number, number][] = [[row, col]];

      // Check in positive direction
      for (let i = 1; i < winCondition; i++) {
        const r = row + dRow * i;
        const c = col + dCol * i;

        if (
          r < 0 ||
          r >= boardSize ||
          c < 0 ||
          c >= boardSize ||
          board[r]?.[c]?.id !== player.id
        ) {
          break;
        }

        count++;
        winCells.push([r, c]);
      }

      // Check in negative direction
      for (let i = 1; i < winCondition; i++) {
        const r = row - dRow * i;
        const c = col - dCol * i;

        if (
          r < 0 ||
          r >= boardSize ||
          c < 0 ||
          c >= boardSize ||
          board[r]?.[c]?.id !== player.id
        ) {
          break;
        }

        count++;
        winCells.push([r, c]);
      }

      // If we have enough cells in a row
      if (count >= winCondition) {
        return winCells;
      }
    }

    return [];
  }

  // Make a move
  const makeMove = (row: number, col: number) => {
    // Skip if game is over or cell is already filled
    if (gameOver || board[row]?.[col] !== null) return;

    const player = players[currentPlayerIndex];
    if (!player) return;

    // Create a new board with the move
    const newBoard = [...board];
    newBoard[row][col] = player;
    setBoard(newBoard);

    // Increment move count
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    // Check for a win
    const winningPositions = checkWin(row, col, player);
    if (winningPositions.length >= winCondition) {
      setWinner(player);
      setWinningCells(winningPositions);
      setGameOver(true);
      return;
    }

    // Check for a draw
    if (newMoveCount === boardSize * boardSize) {
      setGameOver(true);
      return;
    }

    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  // Reset the game with the same players
  const resetGame = () => {
    setBoard(createEmptyBoard(boardSize));
    setCurrentPlayerIndex(0);
    setGameOver(false);
    setWinner(null);
    setWinningCells([]);
    setMoveCount(0);
  };

  // Change board size with enhanced validation
  const changeBoardSize = (size: number) => {
    // Ensure size is within reasonable limits
    const validSize = Math.max(3, Math.min(size, 12));
    setBoardSize(validSize);

    // Ensure win condition is not greater than board size
    if (winCondition > validSize) {
      setWinCondition(validSize);
    }

    // Reset the game with the new board
    setBoard(createEmptyBoard(validSize));
    setCurrentPlayerIndex(0);
    setGameOver(false);
    setWinner(null);
    setWinningCells([]);
    setMoveCount(0);
  };

  // Change win condition with validation
  const changeWinCondition = (condition: number) => {
    // Ensure condition is valid (between 3 and board size)
    const validCondition = Math.max(3, Math.min(condition, boardSize));
    setWinCondition(validCondition);
    resetGame();
  };

  // Start a new game (reset everything including players)
  const startNewGame = () => {
    setPlayers([]);
    resetGame();
  };

  const value = {
    boardSize,
    winCondition,
    players,
    currentPlayerIndex,
    board,
    gameOver,
    winner,
    winningCells,
    moveCount,
    setPlayers,
    makeMove,
    resetGame,
    changeBoardSize,
    changeWinCondition,
    startNewGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
