import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { addItem, appendItem } from "../actions/cartItems";
import isEqual from "lodash/isEqual";
import { v4 as uuidv4 } from "uuid";

export class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      loading: true,
      price: {
        currency: null,
        amount: null,
      },
      checkedRadio: {},
    };
  }
  componentDidMount() {
    //assigning the product based on the param
    this.props.products.forEach((product) => {
      if (product.id === this.props.match.params.itemId) {
        //setting the initial price
        let temp = {};
        product.prices.forEach((price) => {
          if (price.currency === this.props.currency)
            temp = { currency: price.currency, amount: price.amount };
        });
        this.setState({
          product: { ...product },
          loading: false,
          price: { ...temp },
        });
      }
    });
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
    const { product, loading } = this.state;
    const { addItem, cartItems } = this.props;
    const description = product.description;
    return (
      <div className="item-page-container">
        {!loading && product.gallery.length !== 1 && (
          <div className="item-pictures">
            {product.gallery.map((photo) => (
              <img style={{ width: "6rem" }} src={photo} alt="" />
            ))}
          </div>
        )}
        <div className="main-item-picture">
          {!loading && (
            <img
              style={{ width: "100%", height: "100%" }}
              src={product.gallery[0]}
              alt=""
            />
          )}
        </div>
        <div className="item-page-description">
          <h1 style={{ fontWeight: "800" }}>{product.name}</h1>
          {!loading &&
            product.attributes.map((attribute) => (
              <div>
                <p
                  style={{
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong>{attribute.name}:</strong>
                </p>
                <div className="radio-group">
                  {attribute.items.map((item, index) => {
                    return (
                      <div>
                        <input
                          type="radio"
                          name={product.id + attribute.id + "itemPage"}
                          id={product.id + index + attribute.id + "itemPage"}
                          key={product.id + index + attribute.id + "itemPage"}
                          value={item.value}
                          onChange={(e) => {
                            this.setCheckedRadio(
                              attribute.name,
                              e.target.value
                            );
                          }}
                          checked={
                            this.state.checkedRadio !== null
                              ? this.state.checkedRadio[attribute.id] ===
                                item.value
                              : false
                          }
                        />
                        {attribute.type === "swatch" ? (
                          <label
                            htmlFor={
                              product.id + index + attribute.id + "itemPage"
                            }
                            style={{
                              backgroundColor: `${item.value}`,
                            }}
                          ></label>
                        ) : (
                          <label
                            htmlFor={
                              product.id + index + attribute.id + "itemPage"
                            }
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
            {this.state.price.currency} {this.state.price.amount}
          </p>
          <button
            onClick={() => {
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
                this.setState({ checkedRadio: null });
              } else {
                addItem({
                  ...product,
                  selectedAttributes: { ...this.state.checkedRadio },
                });
                this.setState({ checkedRadio: null });
              }
            }}
          >
            ADD TO CART
          </button>
          <div
            style={{ marginTop: "1rem" }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
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
const mapStateToProps = (state) => ({
  products: state.products,
  currency: state.currency,
  cartItems: state.cartItems,
});

export default withRouter(
  connect(mapStateToProps, { addItem, appendItem })(Item)
);
