import { types } from "mobx-state-tree"

/**
 * Product model representing a single product entity
 */
export const Product = types.model("Product", {
  id: types.string,
  name: types.string,
  description: types.maybe(types.string),
  price: types.number,
  currency: types.optional(types.string, "USD"),
  imageUrl: types.maybe(types.string),
  category: types.maybe(types.string),
  inStock: types.optional(types.boolean, true),
  stockCount: types.optional(types.number, 0),
})

/**
 * Category model for product categorization
 */
export const Category = types.model("Category", {
  id: types.string,
  name: types.string,
  description: types.maybe(types.string),
  parentId: types.maybe(types.string),
})

/**
 * Shopping cart item
 */
export const CartItem = types.model("CartItem", {
  productId: types.string,
  quantity: types.number,
  addedAt: types.string,
})

// Export types
export type ProductType = typeof Product
export type CategoryType = typeof Category
export type CartItemType = typeof CartItem