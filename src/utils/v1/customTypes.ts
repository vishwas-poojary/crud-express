import { Logger } from "pino";
import { ItemCategoryType, ItemStatusType } from "./constants";

export interface ApiStatus {
  isSuccess: boolean;
  status: number;
  message?: string;
  data?: unknown;
  toastMessage?: string;
}

export interface ResponseObject {
  status: number;
  message?: string;
  data: unknown;
  toastMessage: string | null;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: ItemCategoryType;
  status: ItemStatusType;
  tags?: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDTO {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: ItemCategoryType;
  status?: ItemStatusType;
  tags?: string[];
}

export interface UpdateItemDTO {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: ItemCategoryType;
  status?: ItemStatusType;
  tags?: string[];
}

export interface QueryItemsParams {
  search?: string;
  category?: ItemCategoryType;
  status?: ItemStatusType;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "quantity";
  sortOrder?: "asc" | "desc";
}

declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      txnId?: string;
      environment?: string;
      log?: Logger;
      apiStatus?: ApiStatus;
      validated_json?: unknown;
      validated_query?: unknown;
      validated_param?: unknown;
    }
  }
}
