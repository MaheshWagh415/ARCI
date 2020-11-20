import createReducer from "./createReducer";
import TYPES from "../types";

let initialState = {
  associateData: null,
  skillData: null,
  associateDashboard: null
};

export const associateReducer = createReducer(initialState, {
  [TYPES.ASSOCIATE](state, action) {
    return Object.assign({}, state, {
      associateData: action.associateData
    });
  },
  [TYPES.GETSKILL](state, action) {
    return Object.assign({}, state, {
      skillData: action.skillData
    });
  },
  [TYPES.INTERVIEW_QUE](state, action) {
    return Object.assign({}, state, {
      interview_que: action.interview_que
    });
  },
  [TYPES.ASSOCIATEDASHBOARD](state, action) {
    return Object.assign({}, state, {
      associateDashboard: action.associateDashboard
    });
  }
});
