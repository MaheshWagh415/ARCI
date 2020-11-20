import TYPES from "../types";
import associateApi from "../api/associate";
import CONSTANTS from '../../lib';

export function associateAction(data) {
  return dispatch => {
    associateApi.associateApi(data, res => {
      if (
        (res && res.message == "Network Error") ||
        res == undefined ||
        (res && res.response && res.response.status != 200)
      ) {
        dispatch({
          type: TYPES.ERROR,
          error:
            res && res.message
              ? res.message
              : CONSTANTS.ERROR.APIERROR
        });
      } else {
        dispatch({
          type: TYPES.ASSOCIATE,
          associateData: res
        });
      }
    });
  };
}

export function getSkillAction(data) {
  return dispatch => {
    associateApi.getSkillApi(data, res => {
      if (
        (res && res.message == "Network Error") ||
        res == undefined ||
        (res && res.response && res.response.status != 200)
      ) {
        dispatch({
          type: TYPES.ERROR,
          error:
            res && res.message
              ? res.message
              : CONSTANTS.ERROR.APIERROR
        });
      } else {
        dispatch({
          type: TYPES.GETSKILL,
          skillData: res
        });
      }
    });
  };
}

export function addInterviewQueAction(data) {
  return dispatch => {
    associateApi.addInterviewQueApi(data, res => {
      if (
        (res && res.message == "Network Error") ||
        res == undefined ||
        (res && res.response && res.response.status != 200)
      ) {
        dispatch({
          type: TYPES.ERROR,
          error:
            res && res.message
              ? res.message
              : CONSTANTS.ERROR.APIERROR
        });
      } else {
        dispatch({
          type: TYPES.INTERVIEW_QUE,
          interview_que: res
        });
      }
    });
  };
}

export function getAssociateDataAction(data) {
  return dispatch => {
    associateApi.getAssociateDataApi(data, res => {
      if(res && res.response && res.response.status == 404) {          
          dispatch({
            type: TYPES.ASSOCIATEDASHBOARD,
            associateDashboard: "You don't have any interview record to show."
          });
      }
      else if (
        (res && res.message == "Network Error") ||
        res == undefined ||
        (res && res.response && res.response.status != 200)
      ) {        
        dispatch({
          type: TYPES.ERROR,
          error:
            res && res.message
              ? res.message
              : CONSTANTS.ERROR.APIERROR
        });
      } else {
        dispatch({
          type: TYPES.ASSOCIATEDASHBOARD,
          associateDashboard: res
        });
      }
    });
  };
}

export function resetDashboardAction() {
  return dispatch => {
    dispatch({
      type: TYPES.ASSOCIATEDASHBOARD,
      associateDashboard: null
    });
  };
}


