import { SHOW_CART, HIDE_CART, TOGGLE_CART } from "../actions/actionTypes";

const initialState = false;

export default function showCart(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case SHOW_CART:
      return (state = true);
    case HIDE_CART:
      return (state = false);
    case TOGGLE_CART:
      return (state = !state);
    default:
      return state;
  }
}
