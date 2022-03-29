const Cell = ({ letter, isActive }) => {
  return <td className="Cell">
    {letter && isActive ? letter : ""}
  </td>;
};

export default Cell;