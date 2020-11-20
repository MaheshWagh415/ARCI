import TYPES from "../types";
import HomeApi from "../api/home";
import { sessionService } from "redux-react-session";
import CONSTANTS from '../../lib';

export function generalAction() {
  return dispatch => {
    HomeApi.generalApi(res => {
      dispatch({
        type: TYPES.GENERAL,
        generalData: res
      });
    })
  }
}

export function upcomingAction(data) {
  return dispatch => {
    HomeApi.upcomingApi(data, res => {
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
          type: TYPES.UPCOMING,
          upcomingData: res
        });
      }
    });
  };
}

export function questionAction(data) {
  return dispatch => {
    HomeApi.questionApi(data, res => {
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
          type: TYPES.QUESTION,
          questionReport: res
        });
      }
    });
  };
}

export function dashboardAction(data) {
  return dispatch => {
    HomeApi.dashboardApi(data, res => {
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
          type: TYPES.DASHBOARD,
          dashboarddata: res
        });
      }
    });
  };
}

export function changePasswordAction(data) {
  return dispatch => {
    HomeApi.changePasswordApi(data, res => {
      if (
        (res && res.message == "Network Error") ||
        res == undefined ||
        (res &&
          res.response &&
          res.response.status != 200 &&
          res.response.status != 500)
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
          type: TYPES.CHANGE_PASSWORD,
          changePasswordRes: res
        });
      }
    });
  };
}



export function errorResetAction() {
  return dispatch => {
    dispatch({
      type: TYPES.ERROR,
      error: null
    });
  };
}

export function pastDataAction(data) {
  return dispatch => {
    HomeApi.pastApi(data, res => {
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
          type: TYPES.PAST_INTERVIEW,
          pastData: res
        });
      }
    });
  };
}

export function spinnerAction(data) {
  return dispatch => {
    dispatch({
      type: TYPES.SPINNER,
      isLoading: data
    });
  };
}

export function userlogout() {
  return dispatchAction => {
    sessionService.deleteSession();
    sessionService.deleteUser();
    dispatchAction(logout());
  };
}

export function logout() {
  return {
    type: TYPES.USER_LOGOUT
  };
}

export function skillAction(data) {
  return dispatch => {
    HomeApi.skillsApi(data, res => {
      dispatch({
        type: TYPES.SKILLS,
        skills: res
      });
    })
  }
}

export function clientAction(data) {
  return dispatch => {
    HomeApi.clientsApi(data, res => {
      dispatch({
        type: TYPES.CLIENTS,
        clients: res
      });
    })
  }
}

export function clientGroupAction(data) {
  return dispatch => {
    HomeApi.clientGroupsApi(data, res => {
      dispatch({
        type: TYPES.CLIENTGROUPS,
        clientgroups: res
      });
    })
  }
}

export function getUsersForAdmin(data) {
  console.log("--Action Called--")
  return dispatch => {
    HomeApi.usersApi(data, res => {
      dispatch({
        type: TYPES.USERS,
        users: res
      });

    })
  }
}

export function notificationAction(data) {
  return dispatch => {
    HomeApi.notificationsApi(data, res => {
      dispatch({
        type: TYPES.NOTIFICATIONS,
        notifications: res
      });
    })
  }
}

export function userType(type) {
  return dispatch => {
    dispatch({
      type: TYPES.CHANGEUSER,
      userRole: type
    })
  }
}


