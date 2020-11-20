import createReducer from "./createReducer";
import TYPES from "../types";

let initialState = {
  users: null,
  clients: null,
  skills : null,
  clientgroups : null
};

export const adminReducer = createReducer(initialState, {
 [TYPES.USERS](state, action) {
    return Object.assign({}, state, {
      users:action.users.data
    })
  },
  [TYPES.CLIENTS](state, action) {
    return Object.assign({}, state, {
      clients: action.clients
    });
  },
  [TYPES.CLIENTGROUPS](state, action) {
    return Object.assign({}, state, {
      clientgroups: action.clientgroups
    });
  },
  [TYPES.SKILLS](state, action) {
    return Object.assign({}, state, {
      skills: action.skills
    });
  }
});


