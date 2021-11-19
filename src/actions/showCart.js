import { SHOW_CART, HIDE_CART, TOGGLE_CART } from "./actionTypes";

export const showCart = () => (dispatch) => {
  dispatch({ type: SHOW_CART });
};
export const hideCart = () => (dispatch) => {
  dispatch({ type: HIDE_CART });
};
export const toggleCart = () => (dispatch) => {
  dispatch({ type: TOGGLE_CART });
};
