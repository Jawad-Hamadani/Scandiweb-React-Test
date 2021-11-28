import React, { Component } from "react";
import { connect } from "react-redux";
import { removeItem, changeItemAmount } from "../actions/cartItems";
import { changeSelectedAttribute } from "../actions/cartItems";
import arrowleft from "../icons/arrowleft.png";
import arrowright from "../icons/arrowright.png";
import PropTypes from "prop-types";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: null,
      selectedAttributes: {},
      selectedPhotoNumber: 0,
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

  incrementSelectedPhotoNumber = () => {
    if (
      this.state.selectedPhotoNumber <
      this.props.cartItem.gallery.length - 1
    ) {
      this.setState((prevState) => {
        return {
          selectedPhotoNumber: prevState.selectedPhotoNumber + 1,
        };
      });
    }
  };

  decrementSelectedPhotoNumber = () => {
    if (this.state.selectedPhotoNumber > 0) {
      this.setState((prevState) => {
        return {
          selectedPhotoNumber: prevState.selectedPhotoNumber - 1,
        };
      });
    }
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
    const { price, selectedPhotoNumber } = this.state;
    const { name, brand, id, gallery, attributes, amount } =
      this.props.cartItem;

    return (
      <div className="cart-flex-container">
        <div className="cart-item-description">
          {size === "small" ? (
            <p>{name}</p>
          ) : (
            <>
              <h1 className="strong-font-weight">{brand}</h1>
              <h2 className="light-font-weight">{name}</h2>
            </>
          )}
          {this.state.price !== null && (
            <p className="strong-font-weight">
              {this.props.currencySymbol}
              <span> </span>
              {price.amount}
            </p>
          )}

          {attributes.map((attribute, index) => (
            <div key={index}>
              <p className="strong-font-weight" id="attribute-name-cartitem">
                {attribute.name}:
              </p>
              <div
                className={
                  size === "large" ? "large-radio-group" : "radio-group"
                }
              >
                {attribute.items.map((item, index) => {
                  return (
                    <div key={item + index}>
                      <input
                        type="radio"
                        name={
                          id + attribute.id + this.props.index + this.props.size
                        }
                        id={
                          id +
                          attribute.id +
                          index +
                          this.props.index +
                          this.props.size
                        }
                        key={
                          id +
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
                          className={
                            size === "large" ? "largeLabels" : undefined
                          }
                          htmlFor={
                            id +
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
                          className={
                            size === "large" ? "largeLabels" : undefined
                          }
                          htmlFor={
                            id +
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
                clone.amount = amount + 1;
                changeItemAmount(clone, index);
              }}
            >
              +
            </button>
            <p key={amount}>{amount}</p>
            <button
              onClick={() => {
                if (amount === 1) {
                  removeItem(index);
                } else {
                  const clone = { ...cartItem };
                  clone.amount = amount - 1;
                  changeItemAmount(clone, index);
                }
              }}
            >
              -
            </button>
          </div>
          <div
            className={
              size === "small"
                ? " small cartitem-image"
                : "  cartitem-image large"
            }
          >
            <img
              id="product-cartItem-image"
              src={gallery[selectedPhotoNumber]}
              alt=""
            />
            {this.props.size === "large" && gallery.length !== 1 && (
              <div className="cart-arrows-container">
                <img
                  onClick={this.decrementSelectedPhotoNumber}
                  src={arrowleft}
                  alt=""
                />
                <img
                  onClick={this.incrementSelectedPhotoNumber}
                  src={arrowright}
                  alt=""
                />
              </div>
            )}
          </div>
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

CartItem.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  changeItemAmount: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  changeSelectedAttribute: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
  cartItem: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.currency,
  currencySymbol: state.currencySymbol,
});
export default connect(mapStateToProps, {
  changeItemAmount,
  removeItem,
  changeSelectedAttribute,
})(CartItem);
