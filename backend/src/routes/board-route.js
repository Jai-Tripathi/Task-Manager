import express from "express";
import { getBoards, createBoard, getTasksInBoard, createTaskInBoard, updateTask, deleteTask } from "../controller/task-controller.js";

const router = express.Router();
router.get('/boards', getBoards);

// Create a new board
router.post('/boards', createBoard);

// Get tasks in a board
router.get('/boards/:id/tasks', getTasksInBoard);

// Create a task in a board
router.post('/boards/:id/tasks', createTaskInBoard);

// Update a task
router.put('/tasks/:id', updateTask);

// Delete a task
router.delete('/tasks/:id', deleteTask);

export default router;