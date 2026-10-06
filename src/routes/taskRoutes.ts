import { Router } from "express";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/taskController";

const router = Router();

// /api/tasks
router.route("/").get(getAllTasks).post(createTask);

// /api/tasks/:id
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
