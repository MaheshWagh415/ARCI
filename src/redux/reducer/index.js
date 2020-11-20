import { combineReducers } from "redux";
import * as userReducer from "./home";
import * as associateReducer from "./associate";
import * as adminReducer from "./adminReducer";
import TYPES from "../types";

export const appReducer = combineReducers({
  ...userReducer,
  ...associateReducer,
  ...adminReducer
});

export const rootReducer = (state, action) => {
  if (action.type === TYPES.USER_LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};


