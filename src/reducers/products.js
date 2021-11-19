import { FETCH_PRODUCTS } from "../actions/actionTypes";

const initialState = [];

export default function products(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_PRODUCTS:
      return (state = [...payload]);
    default:
      return state;
  }
}
