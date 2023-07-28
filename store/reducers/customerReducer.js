import * as types from "../actions/action-types/actions";

const initialState = {
    orders: {},
    orderDetail: {},
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.CUSTOMER_ORDER_SUCCESS:
            return { ...state, orders: action.payload };
        case types.CUSTOMER_ORDER_FAILURE:
            return state;
        case types.CUSTOMER_ORDER_DETAIL_SUCCESS:
            return { ...state, orderDetail: action.payload };
        case types.CUSTOMER_ORDER_DETAIL_FAILURE:
            return state;
        default:
            return state;
    }
};

export { customerReducer };