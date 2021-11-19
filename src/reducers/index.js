import { combineReducers } from "redux";
import products from "./products";
import currency from "./currency";
import cartItems from "./cartItems";
import showCart from "./showCart";

const rootReducer = combineReducers({
  products,
  currency,
  cartItems,
  showCart,
});

export default rootReducer;
