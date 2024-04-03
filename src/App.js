import { useState } from "react";

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [historyOrder, setHistoryOrder] = useState(true);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(historyOrder){
      move = history.length - 1 - move;
    }
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} history={history}/>
        </div>
        <div>
          <ul>You are at move {currentMove}</ul>
          <ul><button onClick={() => (setHistoryOrder(!historyOrder))}>Change history order (asc/desc)</button></ul>
          <ol>{moves}</ol>
        </div>
      </div>
      <div>
      <button style={{marginTop:10}} onClick={() => window.location.reload()}>Restart</button>
      </div>
    </>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove, history}) {
  const calculatedWinner = calculateWinner(squares);
  const winner = calculatedWinner ? calculatedWinner[0] : null;
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  let drawFlag = true;
  for (let i = 0; i < squares.length; i++) {
    if(squares[i] === null) {
      drawFlag = false;
    }
  }
  if (drawFlag && !winner) {
    status = "It's a draw!";
  }
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
  function Rows(handleClick){
    const rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push(
        <div className="board-row" key={i}>
          {Cols(i, handleClick)}
        </div>
      );
    }
    return rows;
  }

  function Cols(i, handleClick){
    const cols = [];
    for (let j = 0; j < 3; j++) {
      const index = i*3+j;
      console.log(currentMove, history.length-1);
      let highlight = 'white';
      if (Number(currentMove)==Number(history.length-1) && calculatedWinner && calculatedWinner.includes(index)){
        highlight = 'yellow';
      }
      console.log(highlight);
      cols.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)} key={`${i}-${j}`} highlight={highlight}/>);
    }
    return cols;
  }

  return (
    <div>
      <div className="status">{status}</div>
      {Rows(handleClick)}
    </div>
  );
}

function Square({value, onSquareClick, highlight}) {
  return (
  <button className="square" style={{backgroundColor: highlight}} onClick={onSquareClick}>
    {value}
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  return null;
}