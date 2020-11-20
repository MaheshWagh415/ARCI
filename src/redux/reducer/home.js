import createReducer from "./createReducer";
import TYPES from "../types";
import { sessionReducer } from "redux-react-session";

export const session = sessionReducer;

let initialState = {
  upcomingData: null,
  dashboarddata: null,
  isLoading: null,
  error: null,
  changePasswordRes: null,
  notifications: null,
  questionReport: null,
  userRole: null
};

export const userReducer = createReducer(initialState, {
  [TYPES.GENERAL](state, action) {
    return Object.assign({}, state, {
      generalData: action.generalData
    });
  },
  [TYPES.UPCOMING](state, action) {
    return Object.assign({}, state, {
      upcomingData: action.upcomingData
    });
  },
  [TYPES.DASHBOARD](state, action) {
    return Object.assign({}, state, {
      dashboarddata: action.dashboarddata
    });
  },
  [TYPES.SPINNER](state, action) {
    return Object.assign({}, state, {
      isLoading: action.isLoading
    });
  },
  [TYPES.ERROR](state, action) {
    return Object.assign({}, state, {
      error: action.error
    });
  },
  [TYPES.CHANGE_PASSWORD](state, action) {
    return Object.assign({}, state, {
      changePasswordRes: action.changePasswordRes
    });
  },
  [TYPES.NOTIFICATIONS](state, action) {
    return Object.assign({}, state, {
      notifications: action.notifications
    });
  },
  [TYPES.QUESTION](state, action) {
    return Object.assign({}, state, {
      questionReport: action.questionReport
    });
  },
  [TYPES.CHANGEUSER](state, action) {
    return Object.assign({}, state, {
      userRole: action.userRole
    });
  },
});

export const pastData = createReducer(
  {},
  {
    [TYPES.PAST_INTERVIEW](state, action) {
      let newState = action.pastData;
      return newState;
    }
  }
);

