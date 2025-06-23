import React from "react";

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState("To Do");
  const [priority, setPriority] = React.useState("Medium");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({ title, status, priority });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-4 rounded shadow-lg w-96">
        <h3 className="text-lg font-bold mb-2">
          {task ? "Edit Task" : "Add Task"}
        </h3>
        <input
          className="w-full p-2 mb-2 bg-gray-700 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="w-full p-2 mb-2 bg-gray-700 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select
          className="w-full p-2 mb-2 bg-gray-700 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <div className="flex justify-end">
          <button
            className="mr-2 bg-gray-600 text-white p-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white p-2 rounded"
            onClick={handleSubmit}
          >
            {task ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
