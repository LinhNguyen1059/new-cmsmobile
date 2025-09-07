/**
 * Auth models
 */
export interface IAuthModel {
  email: string
  password: string
}

/**
 * Auth basic actions (synchronous)
 */
export interface IAuthActions {
  setEmail?(email: string): void
  setPassword?(password: string): void
  clearFields?(): void
}

/**
 * Auth async actions
 */
export interface IAuthAsyncActions {
  login?(): Promise<{
    success: boolean
    error?: string
    user?: {
      id: string
      email: string
      firstName: string
      lastName: string
    }
  }>
  logout?(): Promise<{
    success: boolean
    error?: string
  }>
}

/**
 * Complete Auth interface
 * Combines model, views, and actions for full type safety
 */
export interface IAuth extends IAuthModel, IAuthActions, IAuthAsyncActions {}
