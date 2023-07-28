import * as types from "../actions/action-types/actions";

const initialState = {
  bearer: process.env.mageToken,
  user: {},
  token: "",
  customerBearer: ""
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_USER_SUCCESS:
      return { ...state, user: action.payload };
    case types.GET_USER_FAILURE:
      localStorage.removeItem("authToken");
      return state;
    case types.LOGIN_SUCCESS:
      return { ...state, login: action.payload };
    case types.SIGNUP_SUCCESS:
      return { ...state, register: action.payload };
    case types.CUSTOMER_BEARER:
      return { ...state, customerBearer: action.payload };
    case "LOGOUT_SUCCESS":
      localStorage.removeItem("authToken");
      localStorage.removeItem("cartID");
      return { ...state, user: {}, bearer: "", token: "", customerBearer: "" };
    default:
      return state;
  }
};

export { authReducer };
