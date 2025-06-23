import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
const TaskCard = ({ task, index, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-400";
      case "Medium":
        return "bg-yellow-400";
      case "High":
        return "bg-red-400";
      default:
        return "bg-gray-700"; // Default color if priority is undefined
    }
  };
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-2 mb-2 rounded shadow cursor-move text-white ${getPriorityColor(
            task.priority
          )} hover:bg-opacity-90`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex justify-between items-center">
            <span>{task.title}</span>
            {isHovered && (
              <div className="flex space-x-1">
                <button
                  className="bg-blue-600 text-white p-1 rounded text-xs"
                  onClick={() => onEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white p-1 rounded text-xs"
                  onClick={() => onDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
