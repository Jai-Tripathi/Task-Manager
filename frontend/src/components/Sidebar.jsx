import React from "react";
const Sidebar = ({ boards, selectedBoard, setSelectedBoard, addBoard }) => {
  return (
    <div className="w-64 bg-gray-800 p-4">
      <h2 className="text-lg font-bold mb-4">Boards</h2>
      {boards.map((board) => (
        <div
          key={board._id}
          className={`p-2 cursor-pointer hover:bg-gray-700 ${
            selectedBoard === board._id ? "bg-gray-700" : ""
          }`}
          onClick={() => setSelectedBoard(board._id)}
        >
          {board.name}
        </div>
      ))}
      <button
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded"
        onClick={() => {
          const name = prompt("Enter board name");
          if (name) addBoard(name);
        }}
      >
        Add Board
      </button>
    </div>
  );
};

export default Sidebar;
