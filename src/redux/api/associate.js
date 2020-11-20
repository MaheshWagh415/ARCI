import { GET, GETTOKEN, POSTWTOKEN } from "./core";

export default {
  associateApi: async (data, cb) => {
    let { accessToken, tokenType } = data;
    let API_URL = "/getassociateDashboard" + data;
    let token = tokenType + " " + accessToken;
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  getSkillApi: async (data, cb) => {
    let { accessToken, tokenType } = data;
    let API_URL = "/skills/all";
    let token = tokenType + " " + accessToken;
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  addInterviewQueApi: async (data, cb) => {
    let { accessToken, tokenType } = data;
    delete data.accessToken;
    delete data.tokenType;
    let API_URL = "/associates/associateFeedback";
    let token = tokenType + " " + accessToken;
    let res = await POSTWTOKEN(API_URL, token, data);
    cb(res);
  },
  getAssociateDataApi: async (data, cb) => {
    let { accessToken, tokenType } = data;
    let API_URL =
      "/interviews/interviewByAssociate?Authorization=" +
      data.tokenType +
      " " +
      data.accessToken;
    let token = tokenType + " " + accessToken;
    let res = await GETTOKEN(API_URL, token, data);
    cb(res);
  }
};
