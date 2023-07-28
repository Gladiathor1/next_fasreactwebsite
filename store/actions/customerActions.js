import { api } from "../../services/api";
import * as types from "./action-types/actions";

export const customerOrders = (email) => {
    const currentdate = new Date(); 
    const datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
    let options = {
        url: `orders?searchCriteria[filter_groups][0][filters][0][field]=customer_email&searchCriteria[filter_groups][0][filters][0][value]=${email}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=created_at&searchCriteria[filter_groups][1][filters][0][value]=${datetime}&searchCriteria[filter_groups][1][filters][0][condition_type]=lt&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[pageSize]=20&searchCriteria[currentPage]=1`
    };
    options.types = [types.CUSTOMER_ORDER_SUCCESS, types.CUSTOMER_ORDER_FAILURE];

    return api.get(options);
};


export const customerOrderDetail = (id) => {
    let options = {
        url: `orders/${id}`
    };
    options.types = [types.CUSTOMER_ORDER_DETAIL_SUCCESS, types.CUSTOMER_ORDER_DETAIL_FAILURE];

    return api.get(options);
};
