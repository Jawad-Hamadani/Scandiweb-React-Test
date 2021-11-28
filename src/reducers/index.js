import { combineReducers } from "redux";
import currency from "./currency";
import cartItems from "./cartItems";
import showCart from "./showCart";
import currencySymbol from "./currencySybmol";

const rootReducer = combineReducers({
  currency,
  cartItems,
  showCart,
  currencySymbol,
});

export default rootReducer;
