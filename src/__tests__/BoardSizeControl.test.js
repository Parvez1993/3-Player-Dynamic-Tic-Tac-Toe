import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BoardSizeControl from "../component/BoardSizeControl";
import "@testing-library/jest-dom";

const defaultProps = {
  boardSize: 3,
  winCondition: 3,
  setupComplete: false,
  onBoardSizeChange: jest.fn(),
  onWinConditionChange: jest.fn(),
};

describe("BoardSizeControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders board size and win condition sliders", () => {
    render(<BoardSizeControl {...defaultProps} />);

    expect(
      screen.getByText(
        `Board Size: ${defaultProps.boardSize}×${defaultProps.boardSize}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Win Condition: ${defaultProps.winCondition} in a row`)
    ).toBeInTheDocument();
  });

  it("calls onBoardSizeChange when board size slider changes", () => {
    const mockBoardSizeChange = jest.fn();
    render(
      <BoardSizeControl
        {...defaultProps}
        onBoardSizeChange={mockBoardSizeChange}
      />
    );

    const slider = screen.getByRole("slider", { name: /board size/i });
    fireEvent.change(slider, { target: { value: "5" } });

    expect(mockBoardSizeChange).toHaveBeenCalledWith(5);
  });

  it("ensures win condition cannot exceed board size", () => {
    render(
      <BoardSizeControl {...defaultProps} boardSize={5} winCondition={3} />
    );

    const winConditionSlider = screen.getByRole("slider", {
      name: /win condition/i,
    });
    expect(winConditionSlider).toHaveAttribute("max", "5");
  });
});

// First test: We check that the board size and win condition are properly displayed on the screen.

// Second test: We verify that when the board size slider is adjusted, the correct callback function is called with the new value.

// Third test: We ensure that the win condition slider cannot go beyond the current board size, which is an important validation.
