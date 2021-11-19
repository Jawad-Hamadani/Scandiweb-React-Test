import { FETCH_PRODUCTS } from "./actionTypes";
import { Query, Field, client } from "@tilework/opus";

const productsQuery = new Query("category", true).addField(
  new Field("products")
    .addFieldList([
      "name",
      "id",
      "inStock",
      "category",
      "gallery",
      "description",
    ])
    .addField(new Field("prices").addFieldList(["currency", "amount"]))
    .addField(
      new Field("attributes")
        .addFieldList(["name", "id", "type"])
        .addField(new Field("items").addFieldList(["value", "displayValue"]))
    )
);

export const getProducts = () => (dispatch) => {
  client
    .post(productsQuery)
    .then((res) =>
      dispatch({ type: FETCH_PRODUCTS, payload: res.category.products })
    );
};
