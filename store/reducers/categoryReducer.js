import * as types from '../actions/action-types/actions';

const initialState = {
  categories: [],
  filters: [],
  category: {},
  categoryID: null
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PRODUCTS_SUCCESS:
      return { ...state, category: action.payload.category, categoryID: action.payload.category.id, filters: action.payload.categoryFilters.pfilters };
    case types.GET_CATELOG_SEARCH_CATEGORIES_SUCCESS:
      if (action.payload && action.payload.searchFilters)
        return { ...state, filters: action.payload.searchFilters.pfilters }
      else
        return { ...state };
    case types.GET_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload.categoryList[0].children };
    default:
      return state
  }
}

export { categoryReducer };
