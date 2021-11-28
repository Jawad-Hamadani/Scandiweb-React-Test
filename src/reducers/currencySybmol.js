import { CHANGE_CURRENCY_SYMBOL } from "../actions/actionTypes";

const initialState = "$";

export default function currencySymbol(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CHANGE_CURRENCY_SYMBOL:
      return (state = payload);
    default:
      return state;
  }
}
