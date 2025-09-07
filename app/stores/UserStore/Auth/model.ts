import { types } from "mobx-state-tree"

import { withSetPropAction } from "@/stores/utils/withSetPropAction"

import { authActions, authAsyncActions } from "./action"

export const AuthModel = types
  .model("Auth")
  .props({
    email: "",
    password: "",
  })
  .actions(withSetPropAction)
  .actions(authActions)
  .actions(authAsyncActions)
