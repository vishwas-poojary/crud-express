import { z } from "zod";
import { ITEM_CATEGORY, ITEM_STATUS } from "../../utils/v1/constants";

const categories = Object.values(ITEM_CATEGORY) as [string, ...string[]];
const statuses = Object.values(ITEM_STATUS) as [string, ...string[]];

export const createItemSchema = z.object({
  name: z
    .string({ required_error: "Item name is required" })
    .trim()
    .min(2, "Item name must be at least 2 characters")
    .max(100, "Item name cannot exceed 100 characters"),
  description: z
    .string({ required_error: "Item description is required" })
    .trim()
    .min(5, "Item description must be at least 5 characters")
    .max(500, "Item description cannot exceed 500 characters"),
  price: z.number({ required_error: "Price is required" }).positive("Price must be greater than zero"),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
  category: z.enum(categories, {
    errorMap: () => ({
      message: `Category must be one of: ${categories.join(", ")}`,
    }),
  }),
  status: z
    .enum(statuses, {
      errorMap: () => ({
        message: `Status must be one of: ${statuses.join(", ")}`,
      }),
    })
    .optional()
    .default(ITEM_STATUS.ACTIVE),
  tags: z.array(z.string().trim()).optional(),
});

export const updateItemSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().min(5).max(500).optional(),
    price: z.number().positive().optional(),
    quantity: z.number().int().min(0).optional(),
    category: z
      .enum(categories, {
        errorMap: () => ({
          message: `Category must be one of: ${categories.join(", ")}`,
        }),
      })
      .optional(),
    status: z
      .enum(statuses, {
        errorMap: () => ({
          message: `Status must be one of: ${statuses.join(", ")}`,
        }),
      })
      .optional(),
    tags: z.array(z.string().trim()).optional(),
  })
  .refine(data => Object.keys(data).length > 0, "At least one field must be provided for update");

export const itemIdParamSchema = z.object({
  id: z.string().min(1, "Item ID is required"),
});

export const queryItemsSchema = z.object({
  search: z.string().trim().optional(),
  category: z.enum(categories).optional(),
  status: z.enum(statuses).optional(),
  page: z
    .string()
    .optional()
    .transform(val => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 10)) : 10)),
  sortBy: z.enum(["name", "price", "quantity", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
