import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// FUNCTIONAL COMPONENT
// for when all you're doing is rendering

function Square(props) {
  return (
    <button className={`square ${props.winner ? 'winning-square' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(colIndex, rowIndex) {
    const index = rowIndex * 3 + colIndex;
    const winner = this.props.winner && this.props.winner.indexOf(index) > -1;
    return (
      <Square
        key={'square'+index}
        winner={winner}
        value={this.props.squares[index]}
        onClick={() => this.props.onClick(colIndex, rowIndex)}
      />
    );
  }

  render() {
    return (
      <div>
        {Array(3).fill(null).map((value, rowIndex) => {
          return (
            <div className="board-row" key={'row'+rowIndex}>
              {Array(3).fill(null).map((value, colIndex) => {
                return this.renderSquare(colIndex, rowIndex);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(colIndex, rowIndex) {
    const i = rowIndex * 3 + colIndex
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // use setState to tell React to rerender (and preserve immutablitly)
    this.setState({
      history: history.concat([{
        squares: squares,
        col: colIndex,
        row: rowIndex
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + step.col + ',' + step.row + ')' :
        'Go to gave start';
      return (
        <li key={move} className={move === this.state.stepNumber ? 'selected' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
