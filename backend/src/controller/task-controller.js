import Board from "../models/Board-model.js";
import Task from "../models/Task-model.js";

export const getBoards = async (req, res) => {
    try {
        const boards = await Board.find();
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch boards' });
    }
}

export const createBoard = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const board = new Board({ name });
        await board.save();
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create board' });
    }
}

export const getTasksInBoard = async (req, res) => {
    try {
        const tasks = await Task.find({ boardId: req.params.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}

export const createTaskInBoard = async (req, res) => {
    try {
        const { title, description, status, priority, assignedTo, dueDate } = req.body;
        if (!title || !status || !priority) return res.status(400).json({ error: 'Title, status, and priority are required' });
        const task = new Task({ title, description, status, priority, assignedTo, dueDate, boardId: req.params.id });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, assignedTo, dueDate } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.id, { title, description, status, priority, assignedTo, dueDate }, { new: true });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
}