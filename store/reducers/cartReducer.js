import {
  RESET_CART,
  GET_CART_PRODUCT,
  GET_CART_FAILURE,
  CREATE_CART_SUCCESS,
  OPEN_CART,
  GET_GUEST_CART_PRODUCT,
  GET_PRODUCT_INFO_SUCCESS,
  GET_CART_TOTALS
} from "../actions/action-types/actions";

const initState = {
  cartOpen: false,
  cartID: "",
  cart: {},
  cartItems: [],
  recentItems: [],
  cartTotals: {}
};

const cartReducer = (state = initState, action) => {
  if(action.type === GET_CART_TOTALS) {
    return {
      ...state,
      cartTotals: {
        subtotal: action.payload.subtotal,
        total: action.payload.grand_total,
        discount: action.payload.discount_amount
      }
    }
  }

  if (action.type === "ADD_ITEM") {
    return {
      ...state,
      cartItems: [ ...state.cartItems, action.payload ]
    }
  }

  if (action.type === "UPDATE_QUANTITY") {
    return {
      ...state,
      cartItems: [...state.cartItems].map(item => {
        if(item.sku === action.payload.id) {
          item.qty = action.payload.qty;
        }
        return item;
      })
    }
  }

  if (action.type === "DELETE_ITEM") {
    return {
      ...state,
      cartItems: [...state.cartItems].filter(item => item.sku !== action.payload)
    }
  }

  if (action.type === GET_CART_PRODUCT) {
    return {
      ...state,
      cartItems: action.payload.items || [],
      cart: action.payload
    };
  }

  if(action.type === GET_CART_FAILURE) {
    localStorage.removeItem("cartID");
    return state;
  }

  if (action.type === GET_GUEST_CART_PRODUCT) {
    return {
      ...state,
      cartItems: action.payload.items || []
    };
  }

  if (action.type === CREATE_CART_SUCCESS) {
    localStorage.setItem("cartID", action.payload.createEmptyCart);
    return { ...state, cartID: action.payload.createEmptyCart };
  }

  if (action.type === OPEN_CART) {
    return { ...state, cartOpen: action.value };
  }

  if (action.type === RESET_CART) {
    return { ...state, cartItems: [] };
  }

  if (action.type === GET_PRODUCT_INFO_SUCCESS) {
    return { ...state, recentItems: addRecentItems([...state.recentItems], action.payload) }
  }

  else {
    return { ...state };
  }

  
};

export { cartReducer };
