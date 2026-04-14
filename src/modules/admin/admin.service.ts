import { adminRepository } from "./admin.repository";
import { generateSlug } from "../../util/slug";
import type {
  CreateProductInput,
  UpdateProductInput,
  CreateVariantInput,
  UpdateVariantInput,
  StockAdjustmentInput,
  CreateCategoryInput,
  CreateBrandInput,
  UpdateUserInput,
  AssignRoleInput,
} from "./admin.schema";

export const adminService = {
  // Productos
  createProduct: async (input: CreateProductInput) => {
    const slug = await generateSlug(input.name, "product");
    return adminRepository.createProduct({
      category_id: input.categoryId,
      brand_id: input.brandId,
      sku: input.sku,
      name: input.name,
      slug,
      description: input.description,
      short_description: input.shortDescription,
      base_price: input.basePrice,
      compare_price: input.comparePrice,
      cost_price: input.costPrice,
      weight_kg: input.weightKg,
      is_active: input.isActive,
      is_featured: input.isFeatured,
      requires_compatibility_check: input.requiresCompatibilityCheck,
    });
  },

  updateProduct: async (productId: string, input: UpdateProductInput) => {
    const data: any = {};
    if (input.name) {
      data.name = input.name;
      data.slug = await generateSlug(input.name, "product");
    }
    if (input.categoryId) data.category_id = input.categoryId;
    if (input.brandId) data.brand_id = input.brandId;
    if (input.sku) data.sku = input.sku;
    if (input.description) data.description = input.description;
    if (input.shortDescription) data.short_description = input.shortDescription;
    if (input.basePrice) data.base_price = input.basePrice;
    if (input.comparePrice) data.compare_price = input.comparePrice;
    if (input.costPrice) data.cost_price = input.costPrice;
    if (input.weightKg) data.weight_kg = input.weightKg;
    if (input.isActive !== undefined) data.is_active = input.isActive;
    if (input.isFeatured !== undefined) data.is_featured = input.isFeatured;
    if (input.requiresCompatibilityCheck !== undefined)
      data.requires_compatibility_check = input.requiresCompatibilityCheck;
    data.updated_at = new Date();
    return adminRepository.updateProduct(productId, data);
  },

  deleteProduct: async (productId: string) => {
    await adminRepository.deleteProduct(productId);
    return { message: "Producto eliminado." };
  },

  // Variantes
  createVariant: async (productId: string, input: CreateVariantInput) => {
    return adminRepository.createVariant(productId, {
      sku_variant: input.skuVariant,
      name: input.name,
      price_modifier: input.priceModifier,
      stock_qty: input.stockQty,
      is_active: input.isActive,
      barcode: input.barcode,
    });
  },

  updateVariant: async (variantId: string, input: UpdateVariantInput) => {
    const data: any = {};
    if (input.skuVariant) data.sku_variant = input.skuVariant;
    if (input.name) data.name = input.name;
    if (input.priceModifier !== undefined)
      data.price_modifier = input.priceModifier;
    if (input.stockQty !== undefined) data.stock_qty = input.stockQty;
    if (input.isActive !== undefined) data.is_active = input.isActive;
    if (input.barcode) data.barcode = input.barcode;
    data.updated_at = new Date();
    return adminRepository.updateVariant(variantId, data);
  },

  deleteVariant: async (variantId: string) => {
    await adminRepository.deleteVariant(variantId);
    return { message: "Variante desactivada." };
  },

  // Stock
  adjustStock: async (input: StockAdjustmentInput, adminId: string) => {
    return adminRepository.adjustStock({
      variant_id: input.variantId,
      quantity: input.quantity,
      type: input.type,
      notes: input.notes,
      created_by: adminId,
    });
  },

  // Categorías
  createCategory: async (input: CreateCategoryInput) => {
    let level = 0;
    if (input.parentId) {
      const parent = await adminRepository.getCategoryById(input.parentId);
      level = parent ? (parent.level ?? 0) + 1 : 0;
    }
    return adminRepository.createCategory({
      parent_id: input.parentId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      icon_url: input.iconUrl,
      sort_order: input.sortOrder,
      is_active: input.isActive,
      level,
    });
  },

  updateCategory: async (
    categoryId: string,
    input: Partial<CreateCategoryInput>,
  ) => {
    const data: any = { ...input };
    if (input.parentId) data.parent_id = input.parentId;
    if (input.iconUrl) data.icon_url = input.iconUrl;
    if (input.sortOrder !== undefined) data.sort_order = input.sortOrder;
    if (input.isActive !== undefined) data.is_active = input.isActive;
    return adminRepository.updateCategory(categoryId, data);
  },

  // Marcas
  createBrand: async (input: CreateBrandInput) => {
    return adminRepository.createBrand({
      name: input.name,
      slug: input.slug,
      logo_url: input.logoUrl,
      website: input.website,
      country_of_origin: input.countryOfOrigin,
      is_active: input.isActive,
    });
  },

  updateBrand: async (brandId: string, input: Partial<CreateBrandInput>) => {
    const data: any = {};
    if (input.name) data.name = input.name;
    if (input.slug) data.slug = input.slug;
    if (input.logoUrl) data.logo_url = input.logoUrl;
    if (input.website) data.website = input.website;
    if (input.countryOfOrigin) data.country_of_origin = input.countryOfOrigin;
    if (input.isActive !== undefined) data.is_active = input.isActive;
    return adminRepository.updateBrand(brandId, data);
  },

  // Usuarios
  getUsers: async (page = 1, limit = 20) => {
    const { items, total } = await adminRepository.findAllUsers(page, limit);
    return {
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  updateUser: async (userId: string, input: UpdateUserInput) => {
    return adminRepository.updateUser(userId, {
      is_active: input.isActive,
      is_customer: input.isCustomer,
    });
  },

  // Reportes
  getSalesReport: async (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const orders = await adminRepository.getSalesReport(fromDate, toDate);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce(
      (sum, o) => sum + o.order_item.reduce((s, i) => s + i.quantity, 0),
      0,
    );

    return { totalRevenue, totalOrders, totalItems, orders };
  },

  assignRole: async (userId: string, input: AssignRoleInput) => {
    return adminRepository.assignRole(userId, input.roleSlug);
  },

  getInventory: async (page = 1, limit = 30, stockStatus?: string) => {
    const { items, total } = await adminRepository.getInventory(page, limit, stockStatus);
    return {
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getStockMovements: async (variantId: string, page = 1, limit = 30) => {
    const { items, total } = await adminRepository.getStockMovements(variantId, page, limit);
    return {
      data: items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};
