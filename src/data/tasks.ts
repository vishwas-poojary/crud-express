import { Task } from "../types/task";

// In-memory array storage for tasks
export const tasks: Task[] = [
  {
    id: 1,
    title: "Setup Express Project",
    description: "Initialize project structure and configure dependencies",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Implement CRUD Endpoints",
    description: "Create, Read, Update, and Delete endpoints with validation",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Test with Postman",
    description: "Verify all endpoints handle success and error edge cases",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];
