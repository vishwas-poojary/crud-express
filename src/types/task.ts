export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}
