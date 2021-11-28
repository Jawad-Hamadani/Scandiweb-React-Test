import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import cart from "../icons/emptycart.png";
import isEqual from "lodash/isEqual";
import PropTypes from "prop-types";

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
    const { inStock, gallery, name, id } = this.props.product;
    const { isSelected, price } = this.state;

    return (
      <div
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
        className={isSelected ? "selected-product" : "product"}
        style={{ opacity: !inStock ? "0.5" : "1" }}
      >
        <div
          className=" product-image"
          style={{
            backgroundImage: `url(${gallery[0]})`,
          }}
        >
          {!inStock && <h2>OUT OF STOCK</h2>}
        </div>
        {isSelected && (
          <div
            onClick={() => {
              this.routeChange(`/item/${id}`);
            }}
            className="cart-image-green"
          >
            <img src={cart} alt="cart" />
          </div>
        )}
        <p className="product-name">{name}</p>
        {this.state.price !== null && (
          <p className="product-price">
            {this.props.currencySymbol} {price.amount}
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

Product.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.currency,
  currencySymbol: state.currencySymbol,
});

export default withRouter(connect(mapStateToProps, {})(Product));
