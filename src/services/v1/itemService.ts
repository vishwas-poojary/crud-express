import { Item, CreateItemDTO, UpdateItemDTO, QueryItemsParams } from "../../utils/v1/customTypes";
import { generateId } from "../../utils/v1/helper";
import { ITEM_CATEGORY, ITEM_STATUS } from "../../utils/v1/constants";

// In-memory data store with thread-safe persistence in process
const itemsStore = new Map<string, Item>();

// Seed initial items with predictable IDs for reliable testing
function seedItems(): void {
  const sampleItems: (CreateItemDTO & { id: string })[] = [
    {
      id: "item-101",
      name: "MacBook Pro 16",
      description: "Apple M3 Max, 36GB RAM, 1TB SSD",
      price: 2499.99,
      quantity: 15,
      category: ITEM_CATEGORY.ELECTRONICS,
      status: ITEM_STATUS.ACTIVE,
      tags: ["apple", "laptop", "m3"],
    },
    {
      id: "item-102",
      name: "Ergonomic Office Chair",
      description: "Mesh high-back desk chair with lumbar support",
      price: 299.5,
      quantity: 40,
      category: ITEM_CATEGORY.FURNITURE,
      status: ITEM_STATUS.ACTIVE,
      tags: ["furniture", "chair", "ergonomic"],
    },
    {
      id: "item-103",
      name: "Logitech MX Master 3S",
      description: "Quiet wireless performance mouse for Mac & Windows",
      price: 99.99,
      quantity: 50,
      category: ITEM_CATEGORY.ELECTRONICS,
      status: ITEM_STATUS.ACTIVE,
      tags: ["logitech", "mouse", "wireless"],
    },
    {
      id: "item-104",
      name: "Logitech MX Master 3S",
      description: "Quiet wireless performance mouse for Mac & Windows",
      price: 99.99,
      quantity: 50,
      category: ITEM_CATEGORY.ELECTRONICS,
      status: ITEM_STATUS.ACTIVE,
      tags: ["logitech", "mouse", "wireless"],
    },
    {
      id: "item-105",
      name: "Logitech MX Master 3S",
      description: "Quiet wireless performance mouse for Mac & Windows",
      price: 99.99,
      quantity: 50,
      category: ITEM_CATEGORY.ELECTRONICS,
      status: ITEM_STATUS.ACTIVE,
      tags: ["logitech", "mouse", "wireless"],
    },
  ];

  sampleItems.forEach(item => {
    const now = new Date().toISOString();
    itemsStore.set(item.id, {
      ...item,
      status: item.status || ITEM_STATUS.ACTIVE,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
  });
}

seedItems();

export class ItemService {
  public static async create(dto: CreateItemDTO): Promise<Item> {
    const id = generateId();
    const now = new Date().toISOString();

    const newItem: Item = {
      id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      quantity: dto.quantity,
      category: dto.category,
      status: dto.status || ITEM_STATUS.ACTIVE,
      tags: dto.tags || [],
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    itemsStore.set(id, newItem);
    return newItem;
  }

  public static async getAll(params: QueryItemsParams = {}): Promise<{
    items: Item[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      category,
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    // Filter non-deleted items
    let filtered = Array.from(itemsStore.values()).filter(item => !item.isDeleted);

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some(tag => tag.toLowerCase().includes(query)),
      );
    }

    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }

    if (status) {
      filtered = filtered.filter(item => item.status === status);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        comparison = a.price - b.price;
      } else if (sortBy === "quantity") {
        comparison = a.quantity - b.quantity;
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      totalCount,
      page,
      limit,
      totalPages,
    };
  }

  public static async getById(id: string): Promise<Item | null> {
    const item = itemsStore.get(id);
    if (!item || item.isDeleted) {
      return null;
    }
    return item;
  }

  public static async update(id: string, dto: UpdateItemDTO): Promise<Item | null> {
    const item = itemsStore.get(id);
    if (!item || item.isDeleted) {
      return null;
    }

    const updatedItem: Item = {
      ...item,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    itemsStore.set(id, updatedItem);
    return updatedItem;
  }

  public static async delete(id: string, soft = true): Promise<boolean> {
    const item = itemsStore.get(id);
    if (!item || item.isDeleted) {
      return false;
    }

    if (soft) {
      item.isDeleted = true;
      item.updatedAt = new Date().toISOString();
      itemsStore.set(id, item);
    } else {
      itemsStore.delete(id);
    }

    return true;
  }
}
