import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { AxiosRequestConfig } from "axios"

import Config from "@/config"
import { navigationRef } from "@/navigators/navigationUtilities"

import type { ApiConfig } from "./types"

export const USER_API_CONFIG: ApiConfig = {
  url: Config.I3HOST_API_URL,
  timeout: 30000,
}

/**
 * Manages all requests to Domain A (User Service).
 * This handles all user-related endpoints like authentication, profile, etc.
 */

export class I3HostApi {
  apisauce: ApisauceInstance
  config: ApiConfig
  private logoutCallback?: () => void

  constructor(config: ApiConfig = USER_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  /**
   * Set up response interceptors to handle common scenarios like 401 errors
   */
  private setupInterceptors() {
    this.apisauce.addResponseTransform((response) => {
      if (response.status === 401) {
        this.handle401Error()
      }
    })
  }

  /**
   * Handle 401 Unauthorized errors by logging out the user
   */
  private handle401Error() {
    if (__DEV__) {
      console.log("🚀 ~ 401 Unauthorized")
    }

    // Call the logout callback if it's set
    if (this.logoutCallback) {
      this.logoutCallback()
    }

    // Navigate to login screen
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      })
    }
  }

  /**
   * Set the logout callback function to be called on 401 errors
   */
  setLogoutCallback(callback: () => void) {
    this.logoutCallback = callback
  }

  setBaseURL(url: string) {
    this.apisauce.setBaseURL(url)
  }

  setHeaders(headers: Record<string, string>) {
    this.apisauce.setHeaders(headers)
  }

  setHeader(key: string, value: string) {
    this.apisauce.setHeader(key, value)
  }

  removeHeader(key: string) {
    this.apisauce.deleteHeader(key)
  }

  get<T = any>(
    path: string,
    params?: any,
    options?: AxiosRequestConfig<any>,
  ): Promise<ApiResponse<T>> {
    return this.apisauce.get<T>(path, params, options)
  }

  post<T = any>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig<any>,
  ): Promise<ApiResponse<T>> {
    return this.apisauce.post<T>(path, data, options)
  }

  put<T = any>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig<any>,
  ): Promise<ApiResponse<T>> {
    return this.apisauce.put<T>(path, data, options)
  }

  delete<T = any>(
    path: string,
    params?: any,
    options?: AxiosRequestConfig<any>,
  ): Promise<ApiResponse<T>> {
    return this.apisauce.delete<T>(path, params, options)
  }

  patch<T = any>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig<any>,
  ): Promise<ApiResponse<T>> {
    return this.apisauce.patch<T>(path, data, options)
  }
}

// Singleton instance
export const i3hostApi = new I3HostApi()
