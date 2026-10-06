import { Request, Response, NextFunction } from "express";
import { tasks } from "../data/tasks";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "../types/task";

/**
 * @desc   Get all tasks
 * @route  GET /api/tasks
 */
export const getAllTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { completed } = req.query;

    let result: Task[] = tasks;

    // Optional query parameter filtering: ?completed=true or ?completed=false
    if (completed === "true" || completed === "false") {
      const isCompleted = completed === "true";
      result = tasks.filter(t => t.completed === isCompleted);
    }

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get task by ID
 * @route  GET /api/tasks/:id
 */
export const getTaskById = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a valid number",
      });
      return;
    }

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      res.status(404).json({
        success: false,
        message: `Task with ID ${taskId} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new task
 * @route  POST /api/tasks
 */
export const createTask = (req: Request<{}, {}, CreateTaskDTO>, res: Response, next: NextFunction): void => {
  try {
    const { title, description, completed } = req.body;

    // Basic Validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Title is required and must be a non-empty string",
      });
      return;
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      res.status(400).json({
        success: false,
        message: "Completed status must be a boolean value (true or false)",
      });
      return;
    }

    // Auto-generate incremented ID
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

    const newTask: Task = {
      id: newId,
      title: title.trim(),
      description: description && typeof description === "string" ? description.trim() : "",
      completed: Boolean(completed),
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an existing task
 * @route  PUT /api/tasks/:id
 */
export const updateTask = (
  req: Request<{ id: string }, {}, UpdateTaskDTO>,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a valid number",
      });
      return;
    }

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      res.status(404).json({
        success: false,
        message: `Task with ID ${taskId} not found`,
      });
      return;
    }

    const { title, description, completed } = req.body;

    // Validation for provided fields
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Title must be a non-empty string",
        });
        return;
      }
      tasks[taskIndex].title = title.trim();
    }

    if (description !== undefined) {
      tasks[taskIndex].description = typeof description === "string" ? description.trim() : "";
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        res.status(400).json({
          success: false,
          message: "Completed status must be a boolean value (true or false)",
        });
        return;
      }
      tasks[taskIndex].completed = completed;
    }

    tasks[taskIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: tasks[taskIndex],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a task
 * @route  DELETE /api/tasks/:id
 */
export const deleteTask = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      res.status(400).json({
        success: false,
        message: "Task ID must be a valid number",
      });
      return;
    }

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      res.status(404).json({
        success: false,
        message: `Task with ID ${taskId} not found`,
      });
      return;
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);

    res.status(200).json({
      success: true,
      message: `Task with ID ${taskId} deleted successfully`,
      data: deletedTask,
    });
  } catch (error) {
    next(error);
  }
};
