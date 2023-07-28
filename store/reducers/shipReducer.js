import * as types from "../actions/action-types/actions";

const initialState = {
    methods: [],
    orderSummary: [],
    paymentMethods: []
};

const shipReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SHIPPING_METHOD_SUCCESS:
      return { ...state, methods: action.payload };
    case types.SHIPPING_INFO_SUCCESS:
      return { ...state, orderSummary: action.payload.totals.total_segments, paymentMethods: action.payload.payment_methods }
    default:
      return { ...state };
  }
};

export { shipReducer };