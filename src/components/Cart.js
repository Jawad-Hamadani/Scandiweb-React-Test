import React, { Component } from "react";
import { connect } from "react-redux";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { hideCart } from "../actions/showCart";
import PropTypes from "prop-types";

export class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: null,
      totalPrice: 0,
      itemQuanitity: 0,
    };
  }
  //creating a function that sets the selectedAttributes in the redux store
  setSelectedAttributes = (product, attributeName, attribute) => {
    let temp = { ...this.props.selectedAttributes };
    temp[product] = { ...temp[product] };
    temp[product][attributeName] = attribute;

    return temp;
  };

  //creating a fucntion to modify total price when products are
  //  being added to cart with respect to their amount
  settingTotalPrice = () => {
    let priceFinal = 0;
    this.props.cartItems.forEach((item) => {
      item.prices.forEach((price) => {
        let itemPrice;
        if (price.currency === this.props.currency) {
          itemPrice = price.amount * item.amount;
          priceFinal += itemPrice;
          this.setState({ totalPrice: priceFinal });
        }
      });
    });
  };
  //creating a function to modify total quantity  of the products in cart
  settingTotalQuantity() {
    let finalQuantity = 0;
    this.props.cartItems.forEach((item) => {
      finalQuantity += item.amount;
      this.setState({ itemQuanitity: finalQuantity });
    });
  }

  //setting the prop as state so it can be passed as props and rerender on change
  static getDerivedStateFromProps(props) {
    return {
      size: props.size,
    };
  }
  //calling the settingTotalPrice every time the component mounts
  componentDidMount() {
    this.settingTotalPrice();
  }

  render() {
    const { cartItems, showCart, hideCart, size } = this.props;
    const { itemQuanitity } = this.state;
    if (cartItems.length === 0) {
      //rendering both minicart and cart route if they have no items
      if (size === "small") {
        return (
          <div className={showCart ? "minicart minicart-empty" : " hide-item"}>
            <p id="no-items-text ">
              You have not added any items to the cart yet
            </p>
          </div>
        );
      } else if (size === "large") {
        return (
          <div id="empty-cart-text-large">
            You have not added any items to the cart yet
            <br />
            Go to one of the available categories to add items to cart
          </div>
        );
      }
    } else if (size === "small") {
      //rendering if the cart is small (implying minicart setting)
      return (
        <div className={showCart ? "minicart" : " hide-item"}>
          <p>
            <strong>My Bag, </strong>
            {itemQuanitity} items
          </p>
          <div className="cart-products-container">
            {cartItems.map((cartItem, index) => (
              <CartItem
                size={this.state.size}
                key={index + cartItem.id}
                rerender={cartItem.amount}
                cartItem={cartItem}
                index={index}
              />
            ))}
          </div>
          <div className="total-price">
            <p>Total:</p>
            <p>
              {this.props.currencySymbol} {this.state.totalPrice.toFixed(2)}
            </p>
          </div>
          <div className="checkout-buttons">
            <Link to="/cart">
              <button
                onClick={() => {
                  hideCart();
                }}
              >
                VIEW BAG
              </button>
            </Link>
            <button id="checkout">CHECK OUT</button>
          </div>
        </div>
      );
    } else if (size === "large") {
      //rendering if the cart is large (Cart route)
      return (
        <div className="cart-page">
          <h1>CART</h1>
          {cartItems.map((cartItem, index) => (
            <div key={cartItem + index}>
              <hr />
              <CartItem
                size={this.state.size}
                key={cartItem.id + index}
                rerender={cartItem.amount}
                cartItem={cartItem}
                index={index}
              />
            </div>
          ))}
          <div className="total-price">
            <h2>Total:</h2>
            <h2>
              {this.props.currencySymbol}
              <span> </span>
              {this.state.totalPrice.toFixed(2)}
            </h2>
          </div>
        </div>
      );
    }
  }
  //updating everytime a product is added of the total price
  componentDidUpdate(prevProps) {
    if (
      this.props.cartItems !== prevProps.cartItems ||
      this.props.currency !== prevProps.currency
    ) {
      this.settingTotalPrice();
      this.settingTotalQuantity();
    }
  }
}

Cart.propTypes = {
  size: PropTypes.string.isRequired,
  cartItems: PropTypes.array.isRequired,
  showCart: PropTypes.bool.isRequired,
  currency: PropTypes.string.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  hideCart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems,
    showCart: state.showCart,
    currency: state.currency,
    currencySymbol: state.currencySymbol,
  };
};

export default connect(mapStateToProps, { hideCart })(Cart);
