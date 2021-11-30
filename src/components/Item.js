import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { addItem, appendItem } from "../actions/cartItems";
import isEqual from "lodash/isEqual";
import ReactHtmlParser from "react-html-parser";
import PropTypes from "prop-types";
import { Query, Field, client } from "@tilework/opus";

export class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      loading: true,
      noSelectedAttributes: false,
      price: {
        currency: null,
        amount: null,
      },
      checkedRadio: {},
      selectedImageForDisplay: 0,
    };
  }
  getProduct = async (productId) => {
    const productQuery = new Query("product", true)
      .addArgument("id", "String!", productId)
      .addFieldList([
        "name",
        "id",
        "inStock",
        "category",
        "gallery",
        "description",
        "brand",
      ])
      .addField(new Field("prices").addFieldList(["currency", "amount"]))
      .addField(
        new Field("attributes")
          .addFieldList(["name", "id", "type"])
          .addField(new Field("items").addFieldList(["value", "displayValue"]))
      );

    const res = await client.post(productQuery);

    let temp = {};
    res.product.prices.forEach((price) => {
      if (price.currency === this.props.currency)
        temp = { currency: price.currency, amount: price.amount };
    });

    this.setState({
      product: { ...res.product },
      loading: false,
      price: { ...temp },
    });
  };

  componentDidMount() {
    this.getProduct(this.props.match.params.itemId);
  }
  //creating fucntions
  findObjectBySelectedAttributes = (object, selectedAttributes) => {
    for (let i = 0; i < object.length; i++) {
      if (isEqual(object[i].selectedAttributes, selectedAttributes)) {
        return true;
      }
    }
    return false;
  };
  findWithAttr = (array, attr, value) => {
    for (let i = 0; i < array.length; i += 1) {
      if (isEqual(array[i][attr], value)) {
        return i;
      }
    }
    return -1;
  };
  setCheckedRadio = (attributeName, attribute) => {
    this.setState((prevState) => {
      let temp = { ...prevState.checkedRadio };
      temp[attributeName] = { ...temp[attributeName] };
      temp[attributeName] = attribute;

      return {
        checkedRadio: { ...temp },
      };
    });
  };

  render() {
    const { loading, checkedRadio, selectedImageForDisplay } = this.state;
    const { addItem, cartItems, appendItem } = this.props;
    const { gallery, description, name, brand, attributes, inStock, id } =
      this.state.product;

    return (
      <div className="item-page-container">
        {!loading && gallery.length !== 1 && (
          <div className="item-pictures">
            {gallery.map((photo, index) => (
              <img
                src={photo}
                alt=""
                key={photo + index}
                onClick={() => {
                  this.setState({ selectedImageForDisplay: index });
                }}
              />
            ))}
          </div>
        )}
        <div className="main-item-picture">
          {!loading && (
            <img
              className="item-main-picture"
              src={gallery[selectedImageForDisplay]}
              alt=""
            />
          )}
        </div>
        <div className="item-page-description">
          <h1 className="strong-font-weight">{brand}</h1>
          <h2 className="light-font-weight">{name}</h2>
          {!loading &&
            attributes.map((attribute, index) => (
              <div key={index}>
                <p id="attribute-name-item">
                  <strong>{attribute.name}:</strong>
                </p>
                <div className="radio-group">
                  {attribute.items.map((item, index) => {
                    return (
                      <div key={item + index}>
                        <input
                          type="radio"
                          name={id + attribute.id + "itemPage"}
                          id={id + index + attribute.id + "itemPage"}
                          key={id + index + attribute.id + "itemPage"}
                          value={item.value}
                          onChange={(e) => {
                            this.setCheckedRadio(
                              attribute.name,
                              e.target.value
                            );
                          }}
                          checked={
                            checkedRadio !== null
                              ? checkedRadio[attribute.id] === item.value
                              : false
                          }
                        />
                        {attribute.type === "swatch" ? (
                          <label
                            htmlFor={id + index + attribute.id + "itemPage"}
                            style={{
                              backgroundColor: `${item.value}`,
                            }}
                          ></label>
                        ) : (
                          <label
                            htmlFor={id + index + attribute.id + "itemPage"}
                          >
                            {item.value}
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          <p>
            <strong>PRICE:</strong>
          </p>
          <p>
            {this.props.currencySymbol} {this.state.price.amount}
          </p>
          <button
            onClick={() => {
              if (
                checkedRadio &&
                Object.keys(checkedRadio).length !== attributes.length &&
                Object.getPrototypeOf(checkedRadio) === Object.prototype
              ) {
                this.setState({ noSelectedAttributes: true });
                setTimeout(() => {
                  this.setState({ noSelectedAttributes: false });
                }, 3000);
              } else {
                if (
                  this.findObjectBySelectedAttributes(
                    cartItems,
                    this.state.checkedRadio
                  )
                ) {
                  const productIndex = this.findWithAttr(
                    cartItems,
                    "selectedAttributes",
                    this.state.checkedRadio
                  );
                  const newState = cartItems.slice();
                  newState[productIndex].amount =
                    cartItems[productIndex].amount + 1;
                  appendItem(newState);
                  this.setState({ checkedRadio: {} });
                } else {
                  addItem({
                    ...this.state.product,
                    selectedAttributes: { ...this.state.checkedRadio },
                  });
                  this.setState({ checkedRadio: {} });
                }
              }
            }}
            disabled={!inStock}
            id={!inStock ? "outOfStockbutton" : ""}
          >
            {inStock ? " ADD TO CART" : "OUT OF STOCK"}
          </button>
          {this.state.noSelectedAttributes && (
            <p className="danger">
              Please Select the available attributes you want
            </p>
          )}
          <div>{ReactHtmlParser(description)}</div>
        </div>
      </div>
    );
  }
  componentDidUpdate(prevProps) {
    if (this.props.currency !== prevProps.currency) {
      let temp = {};
      this.state.product.prices.forEach((price) => {
        if (price.currency === this.props.currency)
          temp = { currency: price.currency, amount: price.amount };
      });
      this.setState({
        price: { ...temp },
      });
    }
  }
}

Item.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  cartItems: PropTypes.array.isRequired,
  addItem: PropTypes.func.isRequired,
  appendItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.currency,
  cartItems: state.cartItems,
  currencySymbol: state.currencySymbol,
});

export default withRouter(
  connect(mapStateToProps, { addItem, appendItem })(Item)
);
