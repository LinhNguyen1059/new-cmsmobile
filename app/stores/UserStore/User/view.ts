import { IUserModel } from "./types"

/**
 * UserStore Views - Computed values and getters
 * This file contains all the view/computed logic for the UserStore
 */

export const userViews = (self: IUserModel) => ({
  get fullname() {
    if (!self) {
      return ""
    }
    return `${self?.firstName} ${self?.lastName}`
  },
})
