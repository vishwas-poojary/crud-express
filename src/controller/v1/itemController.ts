import { Request, Response, NextFunction } from "express";
import { CreateItemDTO, UpdateItemDTO, QueryItemsParams } from "../../utils/v1/customTypes";
import { ItemService } from "../../services/v1/itemService";
import { sendResponse } from "../../middleware/exitPoint";
import { HTTP_STATUS } from "../../utils/v1/constants";
import { logger } from "../../utils/v1/logger";

export class ItemController {
  /**
   * POST /v1/items
   * Create a new item
   */
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = req.log || logger;
      const body = (req.validated_json || req.body) as CreateItemDTO;

      log.info({ name: body.name, category: body.category }, "Creating new item");

      const item = await ItemService.create(body);

      log.info({ itemId: item.id }, "Item created successfully");

      sendResponse(res, {
        isSuccess: true,
        status: HTTP_STATUS.CREATED,
        message: "Item created successfully",
        data: item,
        toastMessage: `Item "${item.name}" has been created successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /v1/items
   * Get all items with filtering, search, pagination, and sorting
   */
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = req.log || logger;
      const query = (req.validated_query || req.query) as QueryItemsParams;

      log.info({ query }, "Fetching items list");

      const result = await ItemService.getAll(query);

      log.info({ count: result.items.length, total: result.totalCount }, "Items fetched successfully");

      sendResponse(res, {
        isSuccess: true,
        status: HTTP_STATUS.OK,
        message: "Items fetched successfully",
        data: result,
        toastMessage: `Successfully retrieved ${result.items.length} items`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /v1/items/:id
   * Get single item by ID
   */
  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = req.log || logger;
      const id = req.params.id;

      log.info({ itemId: id }, "Fetching item by ID");

      const item = await ItemService.getById(id);

      if (!item) {
        log.warn({ itemId: id }, "Item not found");
        sendResponse(res, {
          isSuccess: false,
          status: HTTP_STATUS.NOT_FOUND,
          message: "Item not found",
          toastMessage: `Item with ID "${id}" was not found`,
        });
        return;
      }

      log.info({ itemId: id }, "Item retrieved successfully");

      sendResponse(res, {
        isSuccess: true,
        status: HTTP_STATUS.OK,
        message: "Item retrieved successfully",
        data: item,
        toastMessage: "Item retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /v1/items/:id
   * Update item by ID
   */
  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = req.log || logger;
      const id = req.params.id;
      const body = (req.validated_json || req.body) as UpdateItemDTO;

      log.info({ itemId: id, updates: body }, "Updating item");

      const updated = await ItemService.update(id, body);

      if (!updated) {
        log.warn({ itemId: id }, "Item not found for update");
        sendResponse(res, {
          isSuccess: false,
          status: HTTP_STATUS.NOT_FOUND,
          message: "Item not found",
          toastMessage: `Cannot update: Item with ID "${id}" was not found`,
        });
        return;
      }

      log.info({ itemId: id }, "Item updated successfully");

      sendResponse(res, {
        isSuccess: true,
        status: HTTP_STATUS.OK,
        message: "Item updated successfully",
        data: updated,
        toastMessage: `Item "${updated.name}" updated successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /v1/items/:id
   * Soft-delete item by ID
   */
  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const log = req.log || logger;
      const id = req.params.id;

      log.info({ itemId: id }, "Deleting item");

      const deleted = await ItemService.delete(id, true);

      if (!deleted) {
        log.warn({ itemId: id }, "Item not found for deletion");
        sendResponse(res, {
          isSuccess: false,
          status: HTTP_STATUS.NOT_FOUND,
          message: "Item not found",
          toastMessage: `Cannot delete: Item with ID "${id}" was not found`,
        });
        return;
      }

      log.info({ itemId: id }, "Item deleted successfully");

      sendResponse(res, {
        isSuccess: true,
        status: HTTP_STATUS.OK,
        message: "Item deleted successfully",
        data: { id, deleted: true },
        toastMessage: "Item deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
