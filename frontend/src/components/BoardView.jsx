import React, { useState, useEffect } from "react";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

const BoardView = ({ tasks, onDragEnd, addTask, boardId, setTasks }) => {
  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const statuses = ["To Do", "In Progress", "Done"];

  const handleDelete = (taskId) => {
    fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTasks((prev) => {
            const newTasks = { ...prev };
            for (let status in newTasks) {
              newTasks[status] = newTasks[status].filter(
                (t) => t._id !== taskId
              );
            }
            return newTasks;
          });
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSave = (taskData) => {
    if (selectedTask) {
      // Update existing task
      fetch(`${BASE_URL}/tasks/${selectedTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update task");
          return res.json(); // Get the updated task from the backend
        })
        .then((updatedTask) => {
          setTasks((prev) => {
            const newTasks = { ...prev };
            for (let status in newTasks) {
              const index = newTasks[status].findIndex(
                (t) => t._id === selectedTask._id
              );
              if (index !== -1) {
                newTasks[status].splice(index, 1); // Remove from old status
                newTasks[updatedTask.status] =
                  newTasks[updatedTask.status] || [];
                newTasks[updatedTask.status].push(updatedTask); // Add to new status
                break;
              }
            }
            console.log("Updated tasks state:", newTasks); // Debug the new state
            return newTasks;
          });
          setSelectedTask(null);
        })
        .catch((error) => console.error("Error updating task:", error));
    } else {
      // Add new task
      addTask(boardId, taskData);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedTask && isModalOpen) {
      setSelectedTask((prevTask) => ({
        ...prevTask,
        status: "In Progress", // Automatically set to In Progress when editing
      }));
    }
  }, [selectedTask, isModalOpen]);

  return (
    <div className="flex-1 p-4 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {statuses.map((status) => (
            <div key={status} className="w-80">
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  color:
                    status === "To Do"
                      ? "#ef4444"
                      : status === "In Progress"
                      ? "#3b82f6"
                      : "#22c55e",
                }}
              >
                {status}
              </h3>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-800 p-2 min-h-[200px] rounded"
                  >
                    {(tasks[status] || []).map((task, index) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        index={index}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <button
                className="mt-2 w-full bg-green-600 text-white p-2 rounded"
                onClick={() => {
                  setSelectedTask(null);
                  setIsModalOpen(true);
                }}
              >
                Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        // onSave={(taskData) => addTask(boardId, taskData)}
        onSave={handleSave}
        task={selectedTask}
      />
    </div>
  );
};

export default BoardView;
