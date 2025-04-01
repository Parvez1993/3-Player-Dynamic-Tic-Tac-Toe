import React from "react";
import { Box, Typography, Slider, Paper, Grid } from "@mui/material";

interface BoardSizeControlProps {
  boardSize: number;
  winCondition: number;
  onBoardSizeChange: (size: number) => void;
  onWinConditionChange: (condition: number) => void;
  setupComplete: boolean;
}

const BoardSizeControl: React.FC<BoardSizeControlProps> = ({
  boardSize,
  winCondition,
  onBoardSizeChange,
  onWinConditionChange,
  setupComplete,
}) => {
  const handleBoardSizeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    const size = newValue as number;
    onBoardSizeChange(size);
  };

  const handleWinConditionChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    onWinConditionChange(newValue as number);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Game Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography id="board-size-slider" gutterBottom>
            Board Size: {boardSize}×{boardSize}
          </Typography>
          <Slider
            value={boardSize}
            onChange={handleBoardSizeChange}
            aria-labelledby="board-size-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={3}
            max={10}
            disabled={setupComplete}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography id="win-condition-slider" gutterBottom>
            Win Condition: {winCondition} in a row
          </Typography>
          <Slider
            value={winCondition}
            onChange={handleWinConditionChange}
            aria-labelledby="win-condition-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={3}
            max={boardSize}
            disabled={setupComplete}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Connect {winCondition} symbols in a row, column, or diagonal to win.
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Current Configuration: {boardSize}×{boardSize} board with{" "}
          {winCondition} in a row to win
        </Typography>
      </Box>
    </Paper>
  );
};

export default BoardSizeControl;
