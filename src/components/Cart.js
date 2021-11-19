import React, { Component } from "react";
import { connect } from "react-redux";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { hideCart } from "../actions/showCart";

export class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: null,
      totalPrice: 0,
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
    const { cartItems, showCart, hideCart } = this.props;
    const { size, currency } = this.props;
    if (cartItems.length === 0) {
      //rendering both minicart and cart route if they have no items
      if (size === "small") {
        return (
          <div className={showCart ? "minicart minicart-empty" : " hide-item"}>
            <p style={{ padding: "0 1rem" }}>
              You have not added any items to the cart yet
            </p>
          </div>
        );
      } else if (size === "large") {
        return (
          <div style={{ margin: "2rem" }}>
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
            <span style={{ fontWeight: "700" }}>My Bag, </span>
            {cartItems.length} items
          </p>
          <div className="cart-products-container">
            {cartItems.map((cartItem, index) => (
              <CartItem
                size={this.state.size}
                key={cartItem.id}
                rerender={cartItem.amount}
                cartItem={cartItem}
                index={index}
              />
            ))}
          </div>
          <div className="total-price">
            <p>Total:</p>
            <p>
              {currency}
              <span> </span>
              {this.state.totalPrice.toFixed(2)}
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
          <h1 style={{ padding: "2rem 0" }}>CART</h1>
          {cartItems.map((cartItem, index) => (
            <div>
              <hr />
              <CartItem
                size={this.state.size}
                key={cartItem.id}
                rerender={cartItem.amount}
                cartItem={cartItem}
                index={index}
              />
            </div>
          ))}
          <div className="total-price">
            <h2>Total:</h2>
            <h2>
              {currency}
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
    }
  }
}
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems,
    showCart: state.showCart,
    currency: state.currency,
  };
};

export default connect(mapStateToProps, { hideCart })(Cart);
