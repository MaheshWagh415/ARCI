import CONSTANTS from "../lib";

export const checkEmpty = (parm, msg) => {
  if (parm == undefined || parm.length == 0) {
    return CONSTANTS.ERROR.EMPTY + msg + ".";
  } else {
    return parm == undefined;
  }
};

export const validatePhone = no => {
  let re = /^\d+$/;
  if (!re.test(no) || no.length != 10) {
    return CONSTANTS.ERROR.PHONE;
  } else {
    return false;
  }
};
export const checkEqual = (str1, str2) => {
  if (str1 != str2) {
    return CONSTANTS.ERROR.EQUALS_PASSWORD;
  } else {
    return false;
  }
};
export const validateName = (name, msg) => {
  let re = /^[A-Za-z\s]+$/;
  if (!re.test(name)) {
    return CONSTANTS.ERROR.NAME + msg + ".";
  } else {
    return false;
  }
};

export const validateEmail = email => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
    return CONSTANTS.ERROR.EMAIL;
  } else {
    return false;
  }
};

export const validatePassword = password => {
  let re = /^(?=.*[A-Za-z])(?=.*\d).{6,15}$/;
  if (!re.test(password)) {
    return CONSTANTS.ERROR.PASSWORD;
  } else {
    return false;
  }
};
