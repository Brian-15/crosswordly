import { useState } from "react";
import Cell from "./Cell";

const Board = ({ width, height, rows }) => {
  const [rows, setRows] = useState(rows);

  return <table>
    {rows.map(row =>
      <tr>
        {row.map(cell => <Cell letter={cell} />)}
      </tr>
    )}
  </table>
};

module.exports = Board;