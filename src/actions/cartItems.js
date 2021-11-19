import {
  ADD_ITEM,
  APPEND_ITEM,
  CHANGE_ITEM_AMOUNT,
  REMOVE_ITEM,
  CHANGE_SELECTED_ATTRIBUTE,
} from "./actionTypes";

export const addItem = (product) => (dispatch) => {
  dispatch({ type: ADD_ITEM, payload: { ...product, amount: 1 } });
};
export const appendItem = (cartItems) => (dispatch) => {
  dispatch({ type: APPEND_ITEM, payload: cartItems });
};

export const changeItemAmount = (cartItem, index) => (dispatch) => {
  dispatch({ type: CHANGE_ITEM_AMOUNT, payload: cartItem, index: index });
};
export const removeItem = (cartItemIndex) => (dispatch) => {
  dispatch({ type: REMOVE_ITEM, index: cartItemIndex });
};
export const changeSelectedAttribute = (cartItem, index) => (dispatch) => {
  dispatch({
    type: CHANGE_SELECTED_ATTRIBUTE,
    payload: cartItem,
    index: index,
  });
};
