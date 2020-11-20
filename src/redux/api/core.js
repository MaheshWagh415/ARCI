import axios from "axios";
import * as constants from "../../constants";

const BASE_URL = constants.BASE_URL;

const instance = axios.create({
  timeout: 90000,
  responseType: "json"
});

export const GET = url => {
  instance.get({ baseURL: BASE_URL + url });
};

export const POST = url => {
  instance.post({ baseURL: BASE_URL + url });
};

export const GETTOKEN = (url, token) => {
  return instance
    .get(BASE_URL + url, { headers: { Authorization: token } })
    .then(success => {
      return success;
    })
    .catch(error => {
      return error;
    }); 
};

export const POSTTOKEN = (url, token) => {
  return instance
    .post(BASE_URL + url, null, { headers: { Authorization: token } })
    .then(success => {
      return success;
    })
    .catch(error => {
      return error;
    });
};

export const POSTWTOKEN = (url, token, data) => {
  return instance
    .post(BASE_URL + url, data, { headers: { Authorization: token } })
    .then(success => {
      return success;
    })
    .catch(error => {
      return error;
    });
};

export default instance;


