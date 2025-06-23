import { useState, useEffect } from "react";
//import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Sidebar from "./components/Sidebar";
import BoardView from "./components/BoardView";

const App = () => {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState({});
  const [selectedBoard, setSelectedBoard] = useState(null);

  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api";

  useEffect(() => {
    fetch(`${BASE_URL}/boards`)
      .then((res) => res.json())
      .then((data) => setBoards(data));
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      fetch(`${BASE_URL}/boards/${selectedBoard}/tasks`)
        .then((res) => res.json())
        .then((data) => {
          const groupedTasks = data.reduce((acc, task) => {
            acc[task.status] = acc[task.status] || [];
            if (!acc[task.status].some((t) => t._id === task._id)) {
              acc[task.status].push(task);
            }
            return acc;
          }, {});
          setTasks(groupedTasks);
        });
    } else {
      setTasks({}); // Reset tasks when no board is selected
    }
  }, [selectedBoard]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const newTasks = { ...tasks };
    const sourceColumn = newTasks[source.droppableId];
    const destColumn = newTasks[destination.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destColumn.splice(destination.index, 0, movedTask);

    setTasks(newTasks);
    fetch(`${BASE_URL}/tasks/${movedTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: destination.droppableId }),
    });
  };

  const addBoard = (name) => {
    fetch(`${BASE_URL}/boards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((board) => setBoards([...boards, board]));
  };

  const addTask = (boardId, { title, status, priority }) => {
    fetch(`${BASE_URL}/boards/${boardId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status, priority }),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks((prev) => {
          const newTasks = { ...prev };
          if (
            !newTasks[task.status] ||
            !newTasks[task.status].some((t) => t._id === task._id)
          ) {
            newTasks[task.status] = newTasks[task.status] || [];
            newTasks[task.status].push(task);
          } else {
            console.warn("Task already exists, skipping:", task._id); // Debug
          }
          return newTasks;
        });
      });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        boards={boards}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        addBoard={addBoard}
      />
      {selectedBoard && (
        <BoardView
          tasks={tasks}
          onDragEnd={onDragEnd}
          addTask={addTask}
          boardId={selectedBoard}
          setTasks={setTasks}
        />
      )}
    </div>
  );
};

export default App;
