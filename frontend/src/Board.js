import { useState } from "react";
import Cell from "./Cell";
import { v4 as uuid } from "uuid";

const Board = ({ rows, words }) => {
  console.log(rows)
  const [activeCells, setActiveCells] = useState(
    rows.map(row => row.map(cell => {
      return cell ? false : null;
    }))
  );

  return <table>
    <tbody>
    {rows.map((row, rowIdx) =>
      <tr key={uuid()}>
        {row.map((letter, colIdx) =>
          <Cell
            key={uuid()}
            isActive={activeCells[rowIdx][colIdx]}
            letter={letter}
          />
        )}
      </tr>
    )}
    </tbody>
  </table>
};

export default Board;