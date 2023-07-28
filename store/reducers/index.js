import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { categoryReducer } from './categoryReducer';
import { productReducer } from './productReducer';
import { authReducer } from './authReducer';
import { customerReducer } from './customerReducer';
import { shipReducer } from './shipReducer';

export default combineReducers({
  cartReducer,
  categoryReducer,
  productReducer,
  authReducer,
  customerReducer,
  shipReducer
});
