import * as types from './action-types/actions';
import { setProductQuery } from './graphQL/getProductByURL';
import { productBySKU } from './graphQL/getProductBySKU';
import { setQuery } from './graphQL/getProductsByCategory';
import { setSearchFilterQuery } from './graphQL/getSearchedFilters';
import { setSearchQuery } from './graphQL/getSearched';
import { setAttributesQuery } from './graphQL/getAttributes';
import { graph } from '../../services/graphql';

export const getProduct = (url) => {
  let options = setProductQuery(url);

  options.types = [types.GET_PRODUCT_SUCCESS, types.GET_PRODUCT_FAILURE];
  return graph.post(options);
};

export const getProductInfo = (sku) => {
  let options = productBySKU(sku);

  options.types = [types.GET_PRODUCT_INFO_SUCCESS, types.GET_PRODUCT_INFO_FAILURE];
  return graph.post(options);
};

export const currentProduct = (product) => (dispatch) => {
  dispatch({
    type: types.GET_PRODUCT_SUCCESS,
    payload: product
  });
};

export const featuredProducts = (id) => {
  let options = setQuery(id, 1, ``);

  options.types = [
    types.GET_FEATURED_SUCCESS,
    types.GET_FEATURED_FAILURE
  ];

  return graph.post(options);
};

export const specialProducts = (id) => {
  let options = setQuery(id, 1, ``);

  options.types = [
    types.GET_SPECIAL_SUCCESS,
    types.GET_SPECIAL_FAILURE
  ];

  return graph.post(options);
};

export const popularProducts = (id) => {
  let options = setQuery(id, 1, ``);

  options.types = [
    types.GET_POPULAR_SUCCESS,
    types.GET_POPULAR_FAILURE
  ];

  return graph.post(options);
};

export const getFilterOptionsForSeachedProducts = (str) => {
  let options = setSearchFilterQuery(str);

  options.types = [types.GET_CATELOG_SEARCH_CATEGORIES_SUCCESS];
  return graph.post(options);
}

export const searchProducts = (str, page, isCatelogSearch, filters = ``) => {
  let options = setSearchQuery(str.replace('"', ''), page, filters);

  if (isCatelogSearch) {
    if (filters === ``) {
      options.types = [types.GET_CATELOG_SEARCHED_SUCCESS, types.GET_CATELOG_SEARCHED_FAILURE];
    } else {
      options.types = [types.FILTER_GET_CATELOG_SEARCHED_SUCCESS, types.FILTER_GET_CATELOG_SEARCHED_FAILURE];
    }
  } else {
    options.types = [types.GET_SEARCHED_SUCCESS, types.GET_SEARCHED_FAILURE];
  }
  return graph.post(options);
};

export const getProductAttributes = (sku) => {
  let options = setAttributesQuery(sku);

  options.types = [
    types.GET_ATTRIBUTES_SUCCESS,
    types.GET_ATTRIBUTES_FAILURE
  ]
  return graph.post(options);
}
