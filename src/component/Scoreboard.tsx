import React from "react";
import { Paper, Stack, Typography, Avatar, Box } from "@mui/material";
import { Player } from "../types/Players";

interface ScoreBoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  currentPlayerIndex,
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="center"
      sx={{ my: 3 }}
    >
      {players.length > 0 ? (
        players.map((player, index) => (
          <Paper
            key={player.id}
            sx={{
              p: 2,
              minWidth: { xs: "100%", sm: "150px" },
              display: "flex",
              alignItems: "center",
              borderLeft: `4px solid ${player.color}`,
              boxShadow: index === currentPlayerIndex ? 6 : 2,
              transform:
                index === currentPlayerIndex ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s ease",
              position: "relative",
              "&:after":
                index === currentPlayerIndex
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: "calc(50% - 8px)",
                      width: 0,
                      height: 0,
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderTop: `8px solid ${player.color}`,
                    }
                  : {},
            }}
            elevation={index === currentPlayerIndex ? 6 : 2}
          >
            <Avatar
              sx={{
                bgcolor: player.color,
                fontSize: "1.2rem",
                fontWeight: "bold",
                mr: 1.5,
              }}
            >
              {player.symbol}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {player.name}
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No players available
        </Typography>
      )}
    </Stack>
  );
};

export default ScoreBoard;
