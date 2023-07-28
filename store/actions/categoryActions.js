import * as types from './action-types/actions';
import { setCategoriesQuery } from './graphQL/getCategories';
import { setCategoryIDQuery } from './graphQL/getCategoryID';
import { setQuery } from './graphQL/getProductsByCategory';
import { graph } from '../../services/graphql';

export const getCategories = () => {
  let options = setCategoriesQuery();
  options.types = [
    types.GET_CATEGORIES_SUCCESS,
    types.GET_CATEGORIES_FAILURE
  ];

  return graph.post(options);
};

export const getCategoryID = (url) => {
  let options = setCategoryIDQuery(url);
  options.types = [
    types.GET_CATEGORY_ID_SUCCESS,
    types.GET_CATEGORY_ID_FAILURE
  ];

  return graph.post(options);
}

export const getProducts = (id, page, filters = ``) => {
  let options = setQuery(id, page, filters);

  if(filters) {
    options.types = [
      types.FILTER_PRODUCTS_SUCCESS,
      types.FILTER_PRODUCTS_FAILURE
    ]
  } else {
    options.types = [
      types.GET_PRODUCTS_SUCCESS,
      types.GET_PRODUCTS_FAILURE
    ];
  }

  return graph.post(options);
}
