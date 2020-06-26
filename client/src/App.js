import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import produce from 'immer';

// Grid and columns lines count
const Rows = 30;
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
const ButtonsDiv = styled.div`
  display: flex;
  place-content: center;
`
const HeaderDiv = styled.div`
  display: flex;
  place-content: center;
  flex-direction: row-reverse;
  color: #ffffff;
`

const Button = styled.button`
  box-shadow:inset 0px 1px 0px 0px #cf866c;
  background:linear-gradient(to bottom, #d0451b 5%, #bc3315 100%);
  background-color:#d0451b;
  margin: 20px;
  border-radius:3px;
  border:1px solid #942911;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-family:Arial;
  font-size:13px;
  padding:6px 24px;
  text-decoration:none;
  text-shadow:0px 1px 0px #854629;

  &:hover {
    background:linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
    background-color:#bc3315;
  }
  &:active {
    position:relative;
    top:1px;
  }
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


const newGrid = () => {
  return Array.from({ length: Rows }).map(() => Array.from({ length: Columns }).fill(0))
}

const randomGame = () => {
  // const randomNums = Math.random() > .5 ? 1 : 0
  return Array.from({ length: Rows }).map(() => Array.from({ length: Columns }).fill(Math.random() > .5 ? 1 : 0))
}


function App() {
  /* 
    Here i'm creating a new state and creating two arrays filled with zeros
    to display it later with for loop inside the return of the component.
  */
  const [gameGrid, setGameGrid] = useState(newGrid);

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
    <>
      <HeaderDiv>
        <h1>Conway Game of Life</h1><br />
        <ul>
          <h4>Game Rules:</h4>
          <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
          <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
          <li>Lives cells "wrap" around their environment and continue through to the other side.</li>
        </ul>
      </HeaderDiv>
      <MainGrid>
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
      <ButtonsDiv >
        <Button onClick={() => startOnClick()}>{start ? 'STOP' : 'START'}</Button>
        <Button onClick={() => setGameGrid(randomGame())}>RANDOM</Button>
        <Button onClick={() => setGameGrid(newGrid())}>RESET GRID</Button>
      </ButtonsDiv>
    </>
  );
}

export default App;
