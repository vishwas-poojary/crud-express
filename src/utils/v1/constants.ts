export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ITEM_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ARCHIVED: "Archived",
} as const;

export type ItemStatusType = (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];

export const ITEM_CATEGORY = {
  ELECTRONICS: "Electronics",
  FURNITURE: "Furniture",
  HARDWARE: "Hardware",
  STATIONERY: "Stationery",
  OTHER: "Other",
} as const;

export type ItemCategoryType = (typeof ITEM_CATEGORY)[keyof typeof ITEM_CATEGORY];
