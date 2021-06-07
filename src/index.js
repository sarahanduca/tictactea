import React, { createElement } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import confetti from "canvas-confetti";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      <div className="emojis">{props.value}</div>
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let index = 0; index < lines.length; index++) {
    const [a, b, c] = lines[index];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winner = {
        winnerSquares: [a, b, c],
        squares: squares[a],
      };

      return winner;
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard() {
    const rows = 3;
    const cols = 3;

    let board = [];
    let squares = [];
    let currentIndex = 0;

    for (let indexRow = 0; indexRow < rows; indexRow++) {
      for (let indexCol = 0; indexCol < cols; indexCol++) {
        squares = squares.concat(this.renderSquare(currentIndex));
        currentIndex++;
      }

      board = board.concat(
        createElement("div", { key: indexRow, className: "board-row" }, squares)
      );
      squares = [];
    }

    return board;
  }

  render() {
    return <div className="table">{this.renderBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    };
    this.x = "🌿";
    this.o = "🍵";
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? this.x : this.o;
    this.setState({
      history: history.concat([
        {
          squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button className="moves" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner != null) {
      status = "Winner: " + winner.squares;
      confetti({
        particleCount: 150,
        startVelocity: 30,
        spread: 360,
      });
    } else {
      status = "Next player: " + (this.state.xIsNext ? this.x : this.o);
    }

    return (
      <>
        <div className="title">
          <h1>🌿 Tic Tac Tea 🍵</h1>
        </div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => {
                this.handleClick(i);
              }}
            />
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <ol className="listMoves">{moves}</ol>
          </div>
        </div>
      </>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
