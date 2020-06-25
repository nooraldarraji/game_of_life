import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import produce from 'immer';

// Grid and columns lines count
const Rows = 40;
const Columns = 50;

// Main div styling here
const MainGrid = styled.div`
  display: grid;
  place-content: center;
  background: #7B1E0A;
  grid-template-columns: repeat(${Columns}, 20px);
`
// Simulation grid styling here
const SimulationGrid = styled.div`
  width: 20px;
  height: 20px;
  border: solid 1px #635E5D;
  background-color: ${props => props.bg};
`

const op = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]

function App() {
  /* 
    Here i'm creating a new state and creating two arrays filled with zeros
    to display it later with for loop inside the return of the component.
  */
  const [gameGrid, setGameGrid] = useState(Array.from({ length: Rows }).map(() => Array.from({ length: Columns }).fill(0)));

  /* 
    I'm using use state again here to set the initial App run state to be 
    false and flip it later in the callback founction with setTimout
  */
  const [start, setStart] = useState(false)

  /*
    Saving initial app status as a start using "useRef"
  */
  const runningRef = useRef(start)
  runningRef.current = start

  /*
    "run" function is a callback hook will be called recursively every second
    using "setTimeout" and producing a new state with a new calculation based 
    on "game of life" rules below and then set it to the state.

    - Any live cell with two or three live neighbours survives.
    - Any dead cell with three live neighbours becomes a live cell.
    - All other live cells die in the next generation. Similarly, all other dead cells stay dead.
  */
  const run = useCallback(() => {
    if (!runningRef.current) {
      return
    }
    setGameGrid(value => {
      return produce(value, gridCopy => {
        for (let i = 0; i < Rows; i++) {
          for (let j = 0; j < Columns; j++) {
            let neighbors = 0;
            op.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < Rows && newJ >= 0 && newJ < Columns) {
                neighbors += value[newI][newJ]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (value[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1
            }
          }
        }
      });
    });
    setTimeout(run, 100);
  }, [])

  /*
    Here i'm creating a function to start the app below with a setTimout function
    with a reasonable amount of time after the user started to click on the page.
  */
  const startOnClick = () => {
    setStart(!start);
    if (!start) {
      runningRef.current = true;
      run()
    }
  }
  return (
    <MainGrid
      onClick={() => {
        setTimeout(startOnClick, 800)
      }}
    >

      {gameGrid.map((rows, i) =>
        rows.map((col, j) =>
          <SimulationGrid
            /*
              Set the grid square to either die or live using produce to mutate
            */
            bg={gameGrid[i][j] ? 'white' : undefined}
            key={`${i}-${j}`}
            onClick={() => {
              const newGrid = produce(gameGrid, gridCopy => {
                gridCopy[i][j] = gameGrid[i][j] ? 0 : 1;
              })
              /*
                Setting the state to be the old and the new state that we got from "newGrid"
              */
              setGameGrid(newGrid)
            }}
          >
          </SimulationGrid>))}

    </MainGrid>
  );
}

export default App;
