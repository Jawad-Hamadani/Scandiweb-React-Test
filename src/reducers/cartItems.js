import {
  ADD_ITEM,
  APPEND_ITEM,
  CHANGE_ITEM_AMOUNT,
  REMOVE_ITEM,
  CHANGE_SELECTED_ATTRIBUTE,
} from "../actions/actionTypes";

const initialState = [];

export default function cartItems(state = initialState, action) {
  const { type, payload, index } = action;
  switch (type) {
    case ADD_ITEM: {
      return [...state, { ...payload }];
    }
    case APPEND_ITEM:
      return [...payload];

    case CHANGE_ITEM_AMOUNT: {
      const newState = [...state];
      newState[index] = payload;
      return newState;
    }
    case CHANGE_SELECTED_ATTRIBUTE: {
      const newState = [...state];
      newState[index] = payload;
      return newState;
    }
    case REMOVE_ITEM: {
      const newState = [...state];
      newState.splice(index, 1);
      return newState;
    }
    default:
      return state;
  }
}
