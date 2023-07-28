import * as types from "./action-types/actions";
import { api } from "../../services/api";
import { graph } from "../../services/graphql";

export const resetCart = () => {
  return {
    type: types.RESET_CART
  };
};

export const openCartModel = value => {
  return {
    type: types.OPEN_CART,
    value
  };
};

export const addItem = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_ITEM",
    payload: data
  });
}

export const updateCart = (data) => (dispatch) => {
  return dispatch({
    type: "UPDATE_QUANTITY",
    payload: data
  });
}

export const deleteItem = (id) => (dispatch) => {
  return dispatch({
    type: "DELETE_ITEM",
    payload: id
  });
}

export const createCart = () => {
  const token = localStorage.getItem("authToken");
  let options = {};
  options.types = [
    types.CREATE_CART_SUCCESS,
    types.CREATE_CART_FAILURE
  ];
  options.query = `mutation {
    createEmptyCart
  }`;
  return graph.post(options, token);
};

export const addToCartProduct = (payload) => {
  const cartID = localStorage.getItem("cartID");
  const token = localStorage.getItem("authToken");
  let options = { types: [
    types.ADD_TO_CART_PRODUCT,
    types.ADD_TO_CART_FAILURE
  ] };
  if (payload.type === 'ConfigurableProduct') {
    options.query = `mutation {
      addConfigurableProductsToCart(
        input: {
          cart_id: "${cartID}"
          cart_items: [
            {
              parent_sku: "${payload.parent_sku}"
              data: {
                sku: "${payload.variant.sku}"
                custom_price: ${payload.variant.custom_price}
                price: ${payload.variant.price}
                quantity: ${payload.variant.quantity}
                purchased: "${payload.variant.purchased}"
              }
            }
          ]
        }
      ) {
        cart {
          items {
            id
            quantity
            product {
              name
              sku
            }
            ... on ConfigurableCartItem {
              configurable_options {
                option_label
              }
            }
          }
        }
      }
    }`;
  } 
  else {
    options.query = `mutation {
      addSimpleProductsToCart(
          input: {
            cart_id: "${cartID}"
            cart_items: [
              {
                data: {
                  sku: "${payload.sku}"
                  custom_price: ${payload.custom_price}
                  price: ${payload.price}
                  quantity: ${payload.quantity}
                  purchased: "${payload.purchased}"
                }
              }
            ]
          }
        ) {
          cart {
            items {
              id
              product {
                sku
                stock_status
              }
              quantity
            }
          }
        }
      }`;
  }
  return graph.post(options, token);
}

// REMOVE TO CART
export const removeCartProduct = id => {
  const token = localStorage.getItem("authToken");
  const cartID = localStorage.getItem("cartID");
  let options = {};
  if (token) {
    options.url = `carts/mine/items/${id}`;
    options.customerBearer = 'Bearer ' + token;
  } else {
    options.url = `guest-carts/${cartID}/items/${id}`;
  }
  options.types = [
    types.REMOVE_CART_PRODUCT,
    types.REMOVE_CART_PRODUCT_FAILURE
  ];

  return api.delete(options);
};

// UPDATE TO CART
export const updateCartProduct = (itemID, qty) => {
  const token = localStorage.getItem("authToken");
  const cartID = localStorage.getItem("cartID");
  let options = {
    query: `mutation {
    updateCartItems(
      input: {
        cart_id: "${cartID}",
        cart_items: [
          {
            cart_item_id: ${itemID}
            quantity: ${qty}
          }
        ]
      }
    ){
      cart {
        items {
          id
          product {
            sku
            stock_status
          }
          quantity
        }
      }
    }
  }`};
  options.types = [
    types.UPDATE_CART_PRODUCT,
    types.UPDATE_CART_PRODUCT_FAILURE
  ];

  return graph.post(options, token);
};

// GET PRODUCT TO CART
export const getCartProduct = () => {
  const token = localStorage.getItem("authToken");
  const cartID = localStorage.getItem("cartID");
  if (token) {
    let options = { url: `carts/mine` };
    options.types = [types.GET_CART_PRODUCT, types.GET_CART_FAILURE];
    options.customerBearer = 'Bearer ' + token;
    return api.get(options);
  } else {
    if (cartID) {
      let options = { url: `guest-carts/${cartID}` };
      options.types = [types.GET_GUEST_CART_PRODUCT, types.GET_CART_FAILURE];
      return api.get(options);
    }
    return {
      type: types.GET_GUEST_CART_PRODUCT,
      payload: []
    };
  }
};

export const getTotals = () => {
  const token = localStorage.getItem("authToken");
  const cartID = localStorage.getItem("cartID");
  if (token) {
    let options = { url: `carts/mine/totals` };
    options.types = [types.GET_CART_TOTALS, types.GET_CART_TOTALS_FAILURE];
    options.customerBearer = 'Bearer ' + token;
    return api.get(options);
  } else {
    if (cartID) {
      let options = { url: `guest-carts/${cartID}/totals` };
      options.types = [types.GET_CART_TOTALS, types.GET_CART_TOTALS_FAILURE];
      return api.get(options);
    }
    return {
      type: types.GET_CART_TOTALS,
      payload: {}
    };
  }
}

export const mergeCarts = (guest, user, token) => {
  let options = { query: `mutation {
    mergeCustomerCarts(source_cart_id: "${guest}", destination_cart_id: "${user}") {
      items {
        id
        product {
          sku
          stock_status
        }
        quantity
      }
    }
  }` };

  options.types = [
    types.MERGE_CART_SUCCESS,
    types.MERGE_CART_FAILURE
  ];

  return graph.post(options, token);
}

export const customerCart = (token) => {
  let options = { query: `{
    customerCart {
      id
      items {
        id
        product {
          name
          sku
        }
        quantity
      }
    }
  }` };

  options.types = [
    types.CUSTOMER_CART_SUCCESS,
    types.CUSTOMER_CART_FAILURE
  ];

  return graph.post(options, token);
}

export const applyCoupon = (code) => {
  const token = localStorage.getItem("authToken");
  const cartID = localStorage.getItem("cartID");
  let options = { query: `mutation {
    applyCouponToCart(
      input: {
        cart_id: "${cartID}"
        coupon_code: "${code}"
      }
    ) {
      cart {
        applied_coupons {
          code
        }
      }
    }
  }` };

  options.types = [
    types.APPLY_COUPON_SUCCESS,
    types.APPLY_COUPON_FAILURE
  ];

  return graph.post(options, token);
};

export const getRecentItems = () => {
  const token = localStorage.getItem("authToken");
  let options = { query: `{
    getRecentlyOrderedItems {
      items {
        sku
      }
    }
  }` };

  options.types = [
    types.GET_RECENT_SUCCESS,
    types.GET_RECENT_FAILURE
  ];

  return graph.post(options, token);
};
