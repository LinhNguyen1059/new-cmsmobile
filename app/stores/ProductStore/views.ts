/**
 * ProductStore Views - Computed values and getters
 * This demonstrates how to organize views for other stores
 */

export const productStoreViews = (self: any) => ({
  /**
   * Get all products that are in stock
   */
  get productsInStock() {
    return self.products.filter((product: any) => product.inStock && product.stockCount > 0)
  },

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: string) {
    return self.products.filter((product: any) => product.category === categoryId)
  },

  /**
   * Calculate total cart value
   */
  get cartTotal() {
    return self.cartItems.reduce((total: number, item: any) => {
      const product = self.products.find((p: any) => p.id === item.productId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  },

  /**
   * Get cart item count
   */
  get cartItemCount() {
    return self.cartItems.reduce((count: number, item: any) => count + item.quantity, 0)
  },

  /**
   * Check if cart is empty
   */
  get isCartEmpty() {
    return self.cartItems.length === 0
  },

  /**
   * Get formatted cart total
   */
  get formattedCartTotal() {
    // Assuming USD for simplicity
    return `$${this.cartTotal.toFixed(2)}`
  },

  /**
   * Get cart items with product details
   */
  get cartItemsWithDetails() {
    return self.cartItems.map((item: any) => {
      const product = self.products.find((p: any) => p.id === item.productId)
      return {
        ...item,
        product,
        subtotal: product ? product.price * item.quantity : 0,
      }
    })
  },

  /**
   * Search products by name
   */
  searchProducts(query: string) {
    if (!query) return self.products
    return self.products.filter((product: any) => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    )
  },

  /**
   * Get categories with product counts
   */
  get categoriesWithCounts() {
    return self.categories.map((category: any) => ({
      ...category,
      productCount: this.getProductsByCategory(category.id).length,
    }))
  },
})