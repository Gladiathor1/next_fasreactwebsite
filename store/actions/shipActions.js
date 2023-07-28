import { api } from "../../services/api";
import * as types from "./action-types/actions";
import { graph } from "../../services/graphql";

export const addShippingAddress = (data, id) => {
  const token = localStorage.getItem("authToken");
  let options = {};
  if (token) {
    options.url = `/customers/${id}`;
    options.customerBearer = 'Bearer ' + token;
    options.types = [
      types.ADD_SHIPPING_ADDRESS_SUCCESS,
      types.ADD_SHIPPING_ADDRESS_FAILURE
    ];

    return api.post(options, data);
  } else {
    throw 'Cannot Add Shipping/Billing Address'
  }
};

export const shippingMethod = data => {
  const cartID = localStorage.getItem("cartID");
  const token = localStorage.getItem("authToken");
  let options = {};
  if(token) {
    options.url = `carts/mine/estimate-shipping-methods`;
    options.customerBearer = 'Bearer ' + token;
  } else {
    options.url = `guest-carts/${cartID}/estimate-shipping-methods`;
  }
  options.types = [
    types.SHIPPING_METHOD_SUCCESS,
    types.SHIPPING_METHOD_FAILURE
  ];

  return api.post(options, data);
};

export const shippingInfo = data => {
  const cartID = localStorage.getItem("cartID");
  const token = localStorage.getItem("authToken");
  let options = {};
  if(token) {
    options.url = `carts/mine/shipping-information`;
    options.customerBearer = 'Bearer ' + token;
  } else {
    options.url = `guest-carts/${cartID}/shipping-information`;
  }
  options.types = [types.SHIPPING_INFO_SUCCESS, types.SHIPPING_INFO_FAILURE];

  return api.post(options, data);
};

export const processTransaction = data => {
  const cartID = localStorage.getItem("cartID");
  const token = localStorage.getItem("authToken");
  let options = {};
  if(token) {
    options.url = `carts/mine/payment-information`;
    options.customerBearer = 'Bearer ' + token;
  } else {
    options.url = `guest-carts/${cartID}/payment-information`;
  }
  options.types = [types.TRANSACTION_SUCCESS, types.TRANSACTION_FAILURE];

  return api.post(options, data);
};

export const customerCardToken = () => {
  const token = localStorage.getItem("authToken");
  let options = {
    query: `query {
        customerPaymentTokens {
          items {
            details
            public_hash
            payment_method_code
            type
          }
        }
      }`
    };
  options.types = [types.CUSTOMER_TOKEN_SUCCESS, types.CUSTOMER_TOKEN_FAILURE];
  return graph.post(options, token);
};
