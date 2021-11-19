import React, { Component } from "react";
import { connect } from "react-redux";
import { removeItem, changeItemAmount } from "../actions/cartItems";
import { changeSelectedAttribute } from "../actions/cartItems";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: null,
      selectedAttributes: {},
    };
  }
  setSelectedAttributes = (key, value) => {
    const temp = { ...this.state.selectedAttributes };
    temp[key] = value;
    this.setState({
      selectedAttributes: {
        ...temp,
      },
    });
  };
  componentDidMount() {
    let temp = {};
    this.props.cartItem.prices.forEach((price) => {
      if (price.currency === this.props.currency)
        temp = { currency: price.currency, amount: price.amount };
    });
    this.setState({
      price: { ...temp },
    });
    this.setState({
      selectedAttributes: this.props.cartItem.selectedAttributes,
    });
  }

  render() {
    const { size, cartItem, changeItemAmount, removeItem, index } = this.props;
    const { price } = this.state;

    return (
      <div className="cart-flex-container">
        <div className="cart-item-description">
          {size === "small" ? (
            <p>{cartItem.name}</p>
          ) : (
            <h1 style={{ fontWeight: "700" }}>{cartItem.name}</h1>
          )}
          {this.state.price !== null && (
            <p style={{ fontWeight: "700" }}>
              {price.currency}
              <span> </span>
              {price.amount}
            </p>
          )}

          {cartItem.attributes.map((attribute) => (
            <div>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>{attribute.name}:</strong>
              </p>
              <div
                className={
                  size === "large" ? "large-radio-group" : "radio-group"
                }
              >
                {attribute.items.map((item, index) => {
                  return (
                    <div>
                      <input
                        type="radio"
                        name={
                          cartItem.id +
                          attribute.id +
                          this.props.index +
                          this.props.size
                        }
                        id={
                          cartItem.id +
                          attribute.id +
                          index +
                          this.props.index +
                          this.props.size
                        }
                        key={
                          cartItem.id +
                          attribute.id +
                          index +
                          this.props.index +
                          this.props.size
                        }
                        value={item.value}
                        onChange={(e) => {
                          this.setSelectedAttributes(
                            attribute.id,
                            e.target.value
                          );
                        }}
                        checked={
                          this.state.selectedAttributes !== null
                            ? this.state.selectedAttributes[attribute.id] ===
                              item.value
                            : false
                        }
                      />
                      {attribute.type === "swatch" ? (
                        <label
                          className={size === "large" && "largeLabels"}
                          htmlFor={
                            cartItem.id +
                            attribute.id +
                            index +
                            this.props.index +
                            this.props.size
                          }
                          style={{
                            backgroundColor: `${item.value}`,
                          }}
                        ></label>
                      ) : (
                        <label
                          className={size === "large" && "largeLabels"}
                          htmlFor={
                            cartItem.id +
                            attribute.id +
                            index +
                            this.props.index +
                            this.props.size
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
        </div>
        <div className="cart-item-image">
          <div className="add-item">
            <button
              onClick={() => {
                const clone = { ...cartItem };
                clone.amount = cartItem.amount + 1;
                changeItemAmount(clone, index);
              }}
            >
              +
            </button>
            <p key={cartItem.amount}>{cartItem.amount}</p>
            <button
              onClick={() => {
                if (cartItem.amount === 1) {
                  removeItem(index);
                } else {
                  const clone = { ...cartItem };
                  clone.amount = cartItem.amount - 1;
                  changeItemAmount(clone, index);
                }
              }}
            >
              -
            </button>
          </div>
          <img
            className={size === "small" ? " small" : " large"}
            src={cartItem.gallery[0]}
            alt="item"
          />
        </div>
      </div>
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.currency !== prevProps.currency) {
      let temp = {};
      this.props.cartItem.prices.forEach((price) => {
        if (price.currency === this.props.currency)
          temp = { currency: price.currency, amount: price.amount };
      });
      this.setState({
        price: { ...temp },
      });
    }
    if (this.state.selectedAttributes !== prevState.selectedAttributes) {
      let cartItemClone = { ...this.props.cartItem };
      cartItemClone.selectedAttributes = this.state.selectedAttributes;
      this.props.changeSelectedAttribute(cartItemClone, this.props.index);
    }
  }
}
const mapStateToProps = (state) => ({
  currency: state.currency,
});
export default connect(mapStateToProps, {
  changeItemAmount,
  removeItem,
  changeSelectedAttribute,
})(CartItem);
