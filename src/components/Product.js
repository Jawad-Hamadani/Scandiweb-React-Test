import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import cart from "../icons/emptycart.png";
import { addItem, appendItem } from "../actions/cartItems";
import isEqual from "lodash/isEqual";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      price: null,
    };
  }
  //function to dynamically go to route when product is clicked
  routeChange = (path) => {
    this.props.history.push(path);
  };

  componentDidMount() {
    //filter inital price based on currency out and
    //add it to a state variable so it can rerender when changed
    let temp = {};
    this.props.product.prices.forEach((price) => {
      if (price.currency === this.props.currency)
        temp = { currency: price.currency, amount: price.amount };
    });
    this.setState({
      price: { ...temp },
    });
  }

  // function that checks if an array exists in an object through values
  findObjectBySelectedAttributes = (object, selectedAttributes, id) => {
    for (let i = 0; i < object.length; i++) {
      if (
        isEqual(object[i].selectedAttributes, selectedAttributes) &&
        isEqual(object[i].id, id)
      ) {
        return true;
      }
    }
    return false;
  };

  // function that find index of object in an array through attribute
  findWithAttr = (array, attr1, attr2, value1, value2) => {
    for (let i = 0; i < array.length; i += 1) {
      if (
        isEqual(array[i][attr1], value1) &&
        isEqual(array[i][attr2], value2)
      ) {
        return i;
      }
    }
    return -1;
  };

  render() {
    const { product, cartItems, addItem, appendItem } = this.props;
    const { isSelected, price } = this.state;

    return (
      <div
        onClick={() => {
          product.inStock && this.routeChange(`/item/${product.id}`);
        }}
        onMouseEnter={() => {
          this.setState({
            isSelected: true,
          });
        }}
        onMouseLeave={() => {
          this.setState({
            isSelected: false,
          });
        }}
        className={
          isSelected && product.inStock ? "selected-product" : "product"
        }
        style={{ opacity: !product.inStock ? "0.5" : "1" }}
      >
        <div
          className=" product-image"
          style={{
            backgroundImage: `url(${product.gallery[0]})`,
          }}
        >
          {!product.inStock && <h2>OUT OF STOCK</h2>}
        </div>
        {isSelected && product.inStock && (
          <div
            className="cart-image-green"
            onClick={(e) => {
              //so the event doesn't bubble up
              e.stopPropagation();
              if (
                this.findObjectBySelectedAttributes(cartItems, {}, product.id)
              ) {
                const productIndex = this.findWithAttr(
                  cartItems,
                  "selectedAttributes",
                  "id",
                  {},
                  product.id
                );
                const newState = cartItems.slice();
                newState[productIndex].amount =
                  cartItems[productIndex].amount + 1;
                appendItem(newState);
              } else {
                addItem({
                  ...product,
                  selectedAttributes: {},
                });
              }
            }}
          >
            <img src={cart} alt="cart" />
          </div>
        )}
        <p className="product-name">{product.name}</p>
        {this.state.price !== null && (
          <p className="product-price">
            {price.currency}
            <span> </span>
            {price.amount}
          </p>
        )}
      </div>
    );
  }
  //filter inital price based on currency out and
  //add update state variable when currency change
  componentDidUpdate(prevProps) {
    if (this.props.currency !== prevProps.currency) {
      let temp = {};
      this.props.product.prices.forEach((price) => {
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
  currency: state.currency,
  cartItems: state.cartItems,
});

export default withRouter(
  connect(mapStateToProps, { addItem, appendItem })(Product)
);
