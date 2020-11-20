import axios from "axios";
import { GET, GETTOKEN, POSTTOKEN } from "./core";

export default {
  generalApi: cb => {
    axios.get("./tabledata.json")
      .then(success => {
        cb(success);
      })
      .catch(error => {
        cb(error);
      });
  },
  upcomingApi: async (data, cb) => {
    let { from_date, to_date, accessToken, tokenType } = data;
    let API_URL =
      "/interviews/upcoming?fromDate=" + from_date + "&toDate=" + to_date;
    let token = tokenType + " " + accessToken;
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  questionApi: async (data, cb) => {
    console.log(' question api', data)
    let { cname,skills, cGruopy, from_date, to_date, accessToken, tokenType } = data;
    let API_URL =
      "/question-report/?fromDate=" + from_date + "&toDate=" + to_date;
    let token = tokenType + " " + accessToken;
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  dashboardApi: async (data, cb) => {
    let { from_date, to_date, accessToken, tokenType } = data;
    let token = tokenType + " " + accessToken;
    let API_URL =
      "/interviews/all?fromDateTime=" + from_date + "&toDateTime=" + to_date;

    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  changePasswordApi: async (data, cb) => {
    let { password, oldPassword, accessToken, tokenType } = data;
    let token = tokenType + " " + accessToken;
    let API_URL =
      "/api/users/changePassword?password=" +
      password +
      "&oldpassword=" +
      oldPassword;
    let res = await POSTTOKEN(API_URL, token);
    cb(res);
  },  
  pastApi: async (data, cb) => {
    let { from_date, to_date, accessToken, tokenType } = data;
    let token = tokenType + " " + accessToken;
    let API_URL =
      // constants.BASE_URL +
      "/interviews/past?fromDate=" + from_date + "&toDate=" + to_date;

    // axios
    //   .get(API_URL, {
    //     headers: { Authorization: tokenType + " " + accessToken }
    //   })
    //   .then(success => {
    //     cb(success);
    //   })
    //   .catch(error => {
    //     let apiError = error.response;
    //     cb(apiError);
    //   });
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  usersApi: async (data, cb) =>{
    let { accessToken, tokenType } = data;
    let token = tokenType + " " + accessToken;
    let API_URL =
      "/admin/users";
      let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  skillsApi: async (data, cb) => {
    let { accessToken, tokenType } = data;
    let token = tokenType + " " + accessToken;
    let API_URL = "/admin/skills";
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  clientsApi: async (data, cb) => {
    let { accessToken, tokenType } = data;
    let token = tokenType + " " + accessToken;
    let API_URL = "/admin/client";
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },

  notificationsApi: async (data, cb) => {
    let { accessToken, tokenType } = data;
    let token = tokenType + " " + accessToken;
    let API_URL = "/notifications/all";
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  },
  clientGroupsApi: async (data, cb) => {
    let { accessToken, tokenType } = data;
    let token = tokenType + " " + accessToken;
    let API_URL = "/admin/clientGroup";
    let res = await GETTOKEN(API_URL, token);
    cb(res);
  }
};
