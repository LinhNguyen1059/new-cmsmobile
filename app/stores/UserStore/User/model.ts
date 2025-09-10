import { types } from "mobx-state-tree";

import { withSetPropAction } from "@/stores/utils/withSetPropAction";

import { userActions, userAsyncActions } from "./action";
import { userViews } from "./view";

export const UserModel = types
  .model("User")
  .props({
    id: types.maybe(types.string),
    email: types.maybe(types.string),
    firstName: types.maybe(types.string),
    lastName: types.maybe(types.string),
    avatar: types.maybe(types.string),
  })
  .views(userViews)
  .actions(withSetPropAction)
  .actions(userActions)
  .actions(userAsyncActions);
