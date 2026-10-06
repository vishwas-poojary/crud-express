export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Task Management CRUD REST API",
    version: "1.0.0",
    description: "Interactive Swagger documentation for the Express & TypeScript Task CRUD API",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server",
    },
  ],
  paths: {
    "/api/tasks": {
      get: {
        summary: "Get all tasks",
        tags: ["Tasks"],
        parameters: [
          {
            name: "completed",
            in: "query",
            required: false,
            schema: {
              type: "boolean",
            },
            description: "Optional: Filter tasks by completion status (true or false)",
          },
        ],
        responses: {
          200: {
            description: "A list of tasks",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    count: { type: "integer", example: 3 },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Task" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new task",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskDTO" },
            },
          },
        },
        responses: {
          201: {
            description: "Task created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task created successfully" },
                    data: { $ref: "#/components/schemas/Task" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/tasks/{id}": {
      get: {
        summary: "Get task by ID",
        tags: ["Tasks"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Numeric task ID",
          },
        ],
        responses: {
          200: {
            description: "Task details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Task" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid task ID format",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update task by ID",
        tags: ["Tasks"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Numeric task ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskDTO" },
            },
          },
        },
        responses: {
          200: {
            description: "Task updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task updated successfully" },
                    data: { $ref: "#/components/schemas/Task" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error or invalid ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete task by ID",
        tags: ["Tasks"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Numeric task ID",
          },
        ],
        responses: {
          200: {
            description: "Task deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task with ID 1 deleted successfully" },
                    data: { $ref: "#/components/schemas/Task" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid task ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Complete Express CRUD Task" },
          description: { type: "string", example: "Build REST API with TypeScript" },
          completed: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time", example: "2026-10-06T10:00:00.000Z" },
          updatedAt: { type: "string", format: "date-time", example: "2026-10-06T10:30:00.000Z" },
        },
      },
      CreateTaskDTO: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", example: "Implement Swagger Documentation" },
          description: { type: "string", example: "Add interactive API testing UI" },
          completed: { type: "boolean", example: false },
        },
      },
      UpdateTaskDTO: {
        type: "object",
        properties: {
          title: { type: "string", example: "Implement Swagger Documentation (Done)" },
          description: { type: "string", example: "Updated description" },
          completed: { type: "boolean", example: true },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Resource not found or validation error" },
        },
      },
    },
  },
};
