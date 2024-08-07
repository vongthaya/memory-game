import { useState } from 'react';
import data from './data.json';

let shuffleData = shuffle(data);

const BOARD_WIDTH = document.documentElement.offsetWidth / 2;

function shuffle(array) { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}

function Progress({ width, paired, allPaires }) {
  const progressBarWidth = paired / allPaires * 100;

  return (
    <>
      <div className='progress-container' style={{maxWidth: width}}>
        <h3 className='progress-text'>{paired}/{allPaires}</h3>
        <div className="progress-bar-container">
          <div className="progress-bar-base"></div>
          <div className="progress-bar-real" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
      </div>
    </>
  );
}

function Won({ onPlayAgainClick }) {
  return (
    <div className='won'>
      <h3 className='text-won'>You won!!!</h3>
      <button className='btn-play-again' onClick={onPlayAgainClick}>Play Again</button>
    </div>
  );
}

function Square({ image, isFaceUp, index, isMatch, onSquareClick }) {
  let width = BOARD_WIDTH / 6;
  let height = width;

  let squareElem;

  if (isFaceUp) {
    let className = isMatch ? 'square square-up square-match' : 'square square-up';
    squareElem = (
      <div className={className} style={{ width, height }} onClick={() => onSquareClick(index)}>
        <img src={image} className='square-image' />
      </div>
    );
  } else {
    squareElem = (
      <div className="square" style={{ width, height }} onClick={() => onSquareClick(index)}>
        <span className="square-text">?</span>
      </div>
    );
  }

  return squareElem;
}

function Board() {
  const [squares, setSquares] = useState(shuffleData);
  const [previousIndex, setPreviousIndex] = useState(null);
  const paired = squares.filter(square => square.isMatch).length / 2;
  const allPaires = squares.length / 2;
  const isWin = paired === allPaires;

  function flipDown() {
    let newSquares = squares.slice();
    newSquares = newSquares.map((square,) => {
      if (!square.isMatch && previousIndex == null) {
        square.is_face_up = false;
      }
      return square;
    });
    setSquares(newSquares);
}

  function handleSquareClick(i) {
    flipDown();

    const newSquares = squares.slice();
    const currentSquare = newSquares[i];

    if (currentSquare.isMatch) {
      return;
    }

    currentSquare.is_face_up = !currentSquare.is_face_up;

    if (previousIndex == null) {
      setPreviousIndex(i);
    } else {
      let previousSquare = newSquares[previousIndex];
      if (previousSquare.image === currentSquare.image) {
        previousSquare.isMatch = true;
        currentSquare.isMatch = true;
      }
      setPreviousIndex(null);
    }

    setSquares(newSquares);
  }

  function handlePlayAgainClick() {
    shuffleData = shuffle(data).map(square => {
      square.isMatch = false;
      square.is_face_up = false;
      return square;
    });
    setSquares(shuffleData);
  }

  let squareComponents = squares.map((square, i) => (
    <Square 
      key={square.id} 
      image={square.image} 
      isFaceUp={square.is_face_up}
      index={i}
      isMatch={square.isMatch}
      onSquareClick={handleSquareClick} />
  ));

  let boardComponent;

  if (isWin) {
    boardComponent = <Won width={BOARD_WIDTH} onPlayAgainClick={handlePlayAgainClick} />;
  } else {
    boardComponent = (
      <div>
        <Progress width={BOARD_WIDTH} paired={paired} allPaires={allPaires} />
        <div 
          className="board" 
          style={{ maxWidth: BOARD_WIDTH, maxHeight: BOARD_WIDTH }}>
            {squareComponents}
        </div>
      </div>
    );
  }
  
  return boardComponent;
}

function App() {
  return (
    <div className="app">
      <Board />
    </div>
  )
}

export default App
