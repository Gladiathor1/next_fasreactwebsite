import * as types from '../actions/action-types/actions';

const initialState = {
  products: [],
  searched: [],
  featured: [],
  special: [],
  popular: [],
  productDetail: {},
  pagination: {},
  attributes: {},
  filters: false
};

const setPagination = (payload, pagination) => {
  return {
    size: pagination.size ? payload.page_info.current_page * payload.page_info.page_size : payload.page_info.page_size,
    current: payload.page_info.current_page,
    total: payload.total_count
  }
}

const getActive = (items) => {
  return items.filter(e => e.stock_status === "IN_STOCK");
}

const setAttributes = (payload) => {
  let attributes = {};
  const filtered = [...payload].filter(att =>
    att.atr_data.label === "content_all" || att.atr_data.label === "width" || att.atr_data.label === "width_cm" || att.atr_data.label === "color" ||
    att.atr_data.label === "weight_classification" || att.atr_data.label === "weight_linear" || att.atr_data.label === "weight_gm" ||
    att.atr_data.label === "stretch" || att.atr_data.label === "shrinkage" || att.atr_data.label === "care_instructions"
  );
  filtered.forEach(att => attributes[att.atr_data.label] = att.atr_data.value);
  return attributes;
}

const productReducer = (state = initialState, action) => {
  let items = [];
  let currentPage = 0;
  switch (action.type) {
    case types.GET_PRODUCTS_SUCCESS:
      items = [...getActive(action.payload.products.items)];
      currentPage = action.payload.products.page_info.current_page;
      return {
        ...state,
        products: (state.filters || currentPage === 1) ? items : [...state.products, ...items],
        pagination: setPagination(action.payload.products, state.pagination),
        filters: false
      }
    case types.FILTER_PRODUCTS_SUCCESS:
      items = [...getActive(action.payload.products.items)];
      currentPage = action.payload.products.page_info.current_page;
      return {
        ...state,
        products: currentPage === 1 ? items : [...state.products, ...items],
        pagination: setPagination(action.payload.products, state.pagination),
        filters: true
      }
    case types.GET_SEARCHED_SUCCESS:
      let searchItems = [...getActive(action.payload.products.items)];
      return { ...state, searched: [...searchItems], pagination: setPagination(action.payload.products, state.pagination) }
    case types.GET_CATELOG_SEARCHED_SUCCESS:
      if (action.payload && action.payload.products) {
        return {
          ...state,
          searched: [...state.searched, ...getActive(action.payload.products.items)],
          pagination: setPagination(action.payload.products, state.pagination),
          filters: false
        }
      }
    case types.FILTER_GET_CATELOG_SEARCHED_SUCCESS:
      if (action.payload && action.payload.products) {
        return {
          ...state,
          searched: [...getActive(action.payload.products.items)],
          pagination: setPagination(action.payload.products, state.pagination),
          filters: true
        };
      }
    case types.GET_PRODUCT_SUCCESS:
      return { ...state, productDetail: action.payload.products ? action.payload.products.items.length > 0 ? action.payload.products.items[0] : {} : action.payload }
    case types.GET_FEATURED_SUCCESS:
      return { ...state, featured: action.payload.products.items }
    case types.GET_POPULAR_SUCCESS:
      return { ...state, popular: action.payload.products.items }
    case types.GET_SPECIAL_SUCCESS:
      return { ...state, special: action.payload.products.items }
    case types.GET_ATTRIBUTES_SUCCESS:
      return { ...state, attributes: setAttributes(action.payload.attributeValues) }
    default:
      return state
  }
}

export { productReducer };
