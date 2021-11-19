import { CHANGE_CURRENCY } from "../actions/actionTypes";

const initialState = "USD";

export default function currency(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CHANGE_CURRENCY:
      return (state = payload);
    default:
      return state;
  }
}
