import { flow } from "mobx-state-tree"

import { Product, Category, CartItem } from "./models"

/**
 * ProductStore Actions - All mutations and business logic
 * This demonstrates how to organize actions for other stores
 */

/**
 * Basic actions for simple state mutations
 */
export const productStoreActions = (self: any) => ({
  /**
   * Set loading state
   */
  setLoading(loading: boolean) {
    self.isLoading = loading
  },

  /**
   * Set error message
   */
  setError(error: string | null) {
    self.error = error || undefined
  },

  /**
   * Clear error
   */
  clearError() {
    self.error = undefined
  },

  /**
   * Set products
   */
  setProducts(products: any[]) {
    self.products.clear()
    products.forEach(product => {
      self.products.push(Product.create(product))
    })
  },

  /**
   * Add single product
   */
  addProduct(productData: any) {
    const product = Product.create(productData)
    self.products.push(product)
  },

  /**
   * Update product
   */
  updateProduct(productId: string, updates: any) {
    const product = self.products.find((p: any) => p.id === productId)
    if (product) {
      Object.assign(product, updates)
    }
  },

  /**
   * Remove product
   */
  removeProduct(productId: string) {
    const index = self.products.findIndex((p: any) => p.id === productId)
    if (index > -1) {
      self.products.splice(index, 1)
    }
  },

  /**
   * Set categories
   */
  setCategories(categories: any[]) {
    self.categories.clear()
    categories.forEach(category => {
      self.categories.push(Category.create(category))
    })
  },

  /**
   * Add to cart
   */
  addToCart(productId: string, quantity: number = 1) {
    const existingItem = self.cartItems.find((item: any) => item.productId === productId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      self.cartItems.push(CartItem.create({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      }))
    }
  },

  /**
   * Remove from cart
   */
  removeFromCart(productId: string) {
    const index = self.cartItems.findIndex((item: any) => item.productId === productId)
    if (index > -1) {
      self.cartItems.splice(index, 1)
    }
  },

  /**
   * Update cart item quantity
   */
  updateCartItemQuantity(productId: string, quantity: number) {
    const item = self.cartItems.find((item: any) => item.productId === productId)
    if (item) {
      if (quantity <= 0) {
        self.removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  },

  /**
   * Clear cart
   */
  clearCart() {
    self.cartItems.clear()
  },
})

/**
 * Async actions using flow for complex business logic
 */
export const productStoreAsyncActions = (self: any) => ({
  /**
   * Fetch products from API
   */
  fetchProducts: flow(function* () {
    self.setLoading(true)
    self.clearError()

    try {
      // Mock API call
      yield new Promise(resolve => setTimeout(resolve, 1000))

      // Mock data - replace with real API call
      const mockProducts = [
        {
          id: "1",
          name: "Sample Product 1",
          description: "A great product",
          price: 29.99,
          inStock: true,
          stockCount: 10,
          category: "electronics",
        },
        {
          id: "2", 
          name: "Sample Product 2",
          description: "Another great product",
          price: 49.99,
          inStock: true,
          stockCount: 5,
          category: "electronics",
        },
      ]

      self.setProducts(mockProducts)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch products"
      self.setError(errorMessage)
    } finally {
      self.setLoading(false)
    }
  }),

  /**
   * Fetch categories from API
   */
  fetchCategories: flow(function* () {
    try {
      // Mock API call
      yield new Promise(resolve => setTimeout(resolve, 500))

      const mockCategories = [
        { id: "electronics", name: "Electronics", description: "Electronic devices" },
        { id: "clothing", name: "Clothing", description: "Fashion items" },
      ]

      self.setCategories(mockCategories)
    } catch (error) {
      console.warn("Failed to fetch categories:", error)
    }
  }),

  /**
   * Search products
   */
  searchProducts: flow(function* (query: string) {
    self.setLoading(true)
    self.clearError()

    try {
      // Mock API search
      yield new Promise(resolve => setTimeout(resolve, 500))

      // In real app, you'd call API with search query
      // const results = yield api.searchProducts(query)
      // self.setProducts(results)

      console.log("Searching for:", query)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Search failed"
      self.setError(errorMessage)
    } finally {
      self.setLoading(false)
    }
  }),

  /**
   * Initialize the store
   */
  initialize: flow(function* () {
    yield self.fetchCategories()
    yield self.fetchProducts()
  }),
})