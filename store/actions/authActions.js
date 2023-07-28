import { api } from "../../services/api";
import * as types from "./action-types/actions";
import { CUSTOMER_BEARER } from "./action-types/actions";

export const login = params => {
  let options = { url: "integration/customer/token" };
  options.types = [types.LOGIN_SUCCESS, types.LOGIN_FAILURE];

  return api.post(options, params);
};

export const getCustomerBearer = payload => {
  return {
    type: CUSTOMER_BEARER,
    payload
  };
};

export const register = params => {
  let options = { url: "customers" };
  options.types = [types.SIGNUP_SUCCESS, types.SIGNUP_FAILURE];
  return api.post(options, params);
};

export const getUser = params => {
  let options = { url: "user" };
  options.types = [types.GET_USER_SUCCESS, types.GET_USER_FAILURE];

  return api.post(options, params);
};

export const getUserDetail = params => {
  let options = { url: `customers/me` };
  options.types = [types.GET_USER_SUCCESS, types.GET_USER_FAILURE];

  const token = localStorage.getItem("authToken");
  if (token) {
    options.customerBearer = "Bearer " + token;
  }
  return api.get(options);
};

export const updateUser = params => {
  let options = { url: `customers/me` };
  options.types = [types.UPDATE_USER_SUCCESS, types.UPDATE_USER_FAILURE];

  const token = localStorage.getItem("authToken");
  if (token) {
    options.customerBearer = "Bearer " + token;
  }
  return api.put(options, params);
}

export const changePassword = params => {
  let options = { url: "/customers/me/password" };
  const token = localStorage.getItem("authToken");
  if (token) {
    options.customerBearer = "Bearer " + token;
  }
  options.types = [types.CHANGE_PASSWORD_SUCCESS, types.CHANGE_PASSWORD_FAILURE];

  return api.put(options, params);
}

export const forgotPassword = params => {
  let options = { url: "imationsoft/customers/password" };
  options.types = [types.FORGOT_PASSWORD_SUCCESS, types.FORGOT_PASSWORD_FAILURE];

  return api.put(options, params);
};

export const resetPassword = params => {
  let options = { url: "imationsoft/customers/resetPassword" };
  options.types = [types.RESET_PASSWORD_SUCCESS, types.RESET_PASSWORD_FAILURE];

  return api.post(options, params);
};

export const logoutUser = () => dispatch => {
  dispatch({
    type: "GET_CART_PRODUCT",
    payload: []
  });
  dispatch({
    type: "LOGOUT_SUCCESS"
  });
};

export const findExistance = (email) => {
  let options = { url: `/customers/isEmailAvailable` };
  options.types = [
    types.USER_FOUND_SUCCESS,
    types.USER_FOUND_FAILURE
  ];
  const data = {
    customerEmail: email,
    websiteId: "1"
  };

  return api.post(options, data);
}

export const contactUs = params => {
  let options = { url: "/imationsoft/contactus" };
  options.types = [types.CONTACT_US_SUCCESS, types.CONTACT_US_FAILURE];

  return api.post(options, params);
};