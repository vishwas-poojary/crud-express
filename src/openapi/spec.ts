import { ITEM_CATEGORY, ITEM_STATUS } from "../utils/v1/constants";

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Express Enterprise CRUD REST API",
    version: "1.0.0",
    description:
      "Enterprise-grade CRUD REST API using Express.js and TypeScript with complete request/response lifecycle, Zod validation, error handling, and uniform response envelope.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server",
    },
  ],
  tags: [
    {
      name: "Items",
      description: "CRUD operations for Item resources",
    },
    {
      name: "System",
      description: "System health and generic constants",
    },
  ],
  paths: {
    "/v1/generic/health": {
      get: {
        tags: ["System"],
        summary: "Service Health Check",
        description: "Returns uptime, server memory usage, and current timestamp.",
        responses: {
          "200": {
            description: "System is healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/v1/generic/constants": {
      get: {
        tags: ["System"],
        summary: "Get Domain Constants",
        description: "Returns list of accepted categories, item statuses, and HTTP status codes.",
        responses: {
          "200": {
            description: "Constants loaded successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ConstantsResponse" },
              },
            },
          },
        },
      },
    },
    "/v1/items": {
      get: {
        tags: ["Items"],
        summary: "Read All Items",
        description: "Retrieve a paginated list of items with support for search, filtering, and sorting.",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number (1-based)",
            required: false,
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page (max 100)",
            required: false,
            schema: { type: "integer", default: 10 },
          },
          {
            name: "search",
            in: "query",
            description: "Search keyword matching name, description, or tags",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "category",
            in: "query",
            description: "Filter by category",
            required: false,
            schema: {
              type: "string",
              enum: Object.values(ITEM_CATEGORY),
            },
          },
          {
            name: "status",
            in: "query",
            description: "Filter by status",
            required: false,
            schema: {
              type: "string",
              enum: Object.values(ITEM_STATUS),
            },
          },
          {
            name: "sortBy",
            in: "query",
            description: "Sort attribute",
            required: false,
            schema: {
              type: "string",
              enum: ["createdAt", "name", "price", "quantity"],
              default: "createdAt",
            },
          },
          {
            name: "sortOrder",
            in: "query",
            description: "Sort direction",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
          },
        ],
        responses: {
          "200": {
            description: "Items retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GetItemsResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Items"],
        summary: "Create Item",
        description: "Create a new item resource with schema validation.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateItemDTO" },
              examples: {
                monitor: {
                  summary: "Create 4K Monitor",
                  value: {
                    name: "Dell UltraSharp 32 4K Monitor",
                    description: "32-inch 4K UHD USB-C Hub Monitor with IPS Black technology",
                    price: 849.99,
                    quantity: 25,
                    category: "Electronics",
                    status: "Active",
                    tags: ["monitor", "dell", "4k"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Item created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SingleItemResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/v1/items/{id}": {
      get: {
        tags: ["Items"],
        summary: "Read Item by ID",
        description: "Retrieve details of a single item by its unique ID (e.g. item-101, item-102).",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique item ID (e.g. item-101)",
            schema: { type: "string", example: "item-101" },
          },
        ],
        responses: {
          "200": {
            description: "Item retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SingleItemResponse" },
              },
            },
          },
          "404": {
            description: "Item not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NotFoundResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Items"],
        summary: "Update Item",
        description: "Update fields of an existing item resource.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique item ID to update (e.g. item-101)",
            schema: { type: "string", example: "item-101" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateItemDTO" },
              example: {
                price: 2299.99,
                quantity: 18,
                description: "Updated discount price on Apple MacBook Pro 16",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Item updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SingleItemResponse" },
              },
            },
          },
          "404": {
            description: "Item not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NotFoundResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Items"],
        summary: "Delete Item",
        description: "Soft-delete an item by its unique ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Unique item ID to delete (e.g. item-101)",
            schema: { type: "string", example: "item-101" },
          },
        ],
        responses: {
          "200": {
            description: "Item deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteResponse" },
              },
            },
          },
          "404": {
            description: "Item not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NotFoundResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateItemDTO: {
        type: "object",
        required: ["name", "description", "price", "quantity", "category"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100, example: "Dell UltraSharp 32 4K Monitor" },
          description: {
            type: "string",
            minLength: 5,
            maxLength: 500,
            example: "32-inch 4K UHD USB-C Hub Monitor with IPS Black technology",
          },
          price: { type: "number", minimum: 0.01, example: 849.99 },
          quantity: { type: "integer", minimum: 0, example: 25 },
          category: {
            type: "string",
            enum: Object.values(ITEM_CATEGORY),
            example: "Electronics",
          },
          status: {
            type: "string",
            enum: Object.values(ITEM_STATUS),
            example: "Active",
          },
          tags: {
            type: "array",
            items: { type: "string" },
            example: ["monitor", "dell", "4k"],
          },
        },
      },
      UpdateItemDTO: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          description: { type: "string", minLength: 5, maxLength: 500 },
          price: { type: "number", minimum: 0.01 },
          quantity: { type: "integer", minimum: 0 },
          category: { type: "string", enum: Object.values(ITEM_CATEGORY) },
          status: { type: "string", enum: Object.values(ITEM_STATUS) },
          tags: { type: "array", items: { type: "string" } },
        },
      },
      Item: {
        type: "object",
        properties: {
          id: { type: "string", example: "item-101" },
          name: { type: "string", example: "MacBook Pro 16" },
          description: { type: "string", example: "Apple M3 Max, 36GB RAM, 1TB SSD" },
          price: { type: "number", example: 2499.99 },
          quantity: { type: "integer", example: 15 },
          category: { type: "string", example: "Electronics" },
          status: { type: "string", example: "Active" },
          tags: { type: "array", items: { type: "string" }, example: ["apple", "laptop", "m3"] },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SingleItemResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          message: { type: "string", example: "Item retrieved successfully" },
          data: { $ref: "#/components/schemas/Item" },
          toastMessage: { type: "string", example: "Item retrieved successfully" },
        },
      },
      GetItemsResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          message: { type: "string", example: "Items fetched successfully" },
          data: {
            type: "object",
            properties: {
              items: { type: "array", items: { $ref: "#/components/schemas/Item" } },
              totalCount: { type: "integer", example: 3 },
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              totalPages: { type: "integer", example: 1 },
            },
          },
          toastMessage: { type: "string", example: "Successfully retrieved 3 items" },
        },
      },
      DeleteResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          message: { type: "string", example: "Item deleted successfully" },
          data: {
            type: "object",
            properties: {
              id: { type: "string", example: "item-101" },
              deleted: { type: "boolean", example: true },
            },
          },
          toastMessage: { type: "string", example: "Item deleted successfully" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 400 },
          message: { type: "string", example: "Validation failed" },
          data: {
            type: "object",
            properties: {
              issues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "name" },
                    message: { type: "string", example: "Item name must be at least 2 characters" },
                    code: { type: "string", example: "too_small" },
                  },
                },
              },
            },
          },
          toastMessage: { type: "string", example: "Item name must be at least 2 characters" },
        },
      },
      NotFoundResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 404 },
          message: { type: "string", example: "Item not found" },
          data: { type: "null", example: null },
          toastMessage: { type: "string", example: 'Item with ID "xyz" was not found' },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          message: { type: "string", example: "Service is healthy" },
          data: {
            type: "object",
            properties: {
              uptime: { type: "number", example: 120.45 },
              timestamp: { type: "string", format: "date-time" },
            },
          },
          toastMessage: { type: "string", example: "System healthy" },
        },
      },
      ConstantsResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          message: { type: "string", example: "Constants fetched successfully" },
          data: { type: "object" },
          toastMessage: { type: "string", example: "Constants loaded" },
        },
      },
    },
  },
};
