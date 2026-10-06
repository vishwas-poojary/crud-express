import { Router } from "express";
import { ItemController } from "../../controller/v1/itemController";
import { validate } from "../../middleware/zodValidator";
import {
  createItemSchema,
  updateItemSchema,
  itemIdParamSchema,
  queryItemsSchema,
} from "../../schemas/v1/itemSchema";

const itemRoutes = Router();

// Create
itemRoutes.post("/", validate(createItemSchema, "json"), ItemController.create);

// Read All (with filters, pagination, search, sort)
itemRoutes.get("/", validate(queryItemsSchema, "query"), ItemController.getAll);

// Read by ID
itemRoutes.get("/:id", validate(itemIdParamSchema, "param"), ItemController.getById);

// Update by ID
itemRoutes.put(
  "/:id",
  validate(itemIdParamSchema, "param"),
  validate(updateItemSchema, "json"),
  ItemController.update,
);

// Delete by ID
itemRoutes.delete("/:id", validate(itemIdParamSchema, "param"), ItemController.delete);

export { itemRoutes };
