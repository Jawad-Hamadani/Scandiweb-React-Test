import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import brand from "../icons/brand.png";
import cart from "../icons/cart.png";
import { Query, client } from "@tilework/opus";
import arrowdwn from "../icons/arrowdwn.png";
import arrowup from "../icons/arrowup.png";
import {
  CHANGE_CURRENCY,
  CHANGE_CURRENCY_SYMBOL,
} from "../actions/actionTypes";
import { connect } from "react-redux";
import { toggleCart, hideCart } from "../actions/showCart";
import Cart from "./Cart";
import PropTypes from "prop-types";

//setting client endpoint
client.setEndpoint("http://localhost:4000/");
//creating graphQl queries
//creating query for categories
const getCategsQuery = new Query("categories", true).addFieldList(["name"]);
//creating query for currencies
const getCurrencQuery = new Query("currencies", true);

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      categoriesNames: [],
      currencies: [],
      loading: true,
      itemQuanitity: 0,
      displayCurrencies: false,
    };
  }
  componentDidMount() {
    //fetching the getCategsQuery
    const categsData = client.post(getCategsQuery);
    categsData.then((data) => {
      let arr = [];
      data.categories.forEach((category) => {
        arr.push(category.name);
      });
      //putting the categories in a state variable
      this.setState({
        categoriesNames: [...this.state.categoriesNames, ...arr],
        loading: false,
      });
    });
    //fetching the getCurrencQuery
    client.post(getCurrencQuery).then((data) => {
      let arr = [];
      data.currencies.forEach((currency) => {
        arr.push(currency);
      });
      //putting the currencies in a state variable
      this.setState({
        currencies: [...this.state.currencies, ...arr],
        loading: false,
      });
    });
  }
  //creating a function to modify total quantity  of the products in cart
  settingTotalQuantity() {
    let finalQuantity = 0;
    if (this.props.cartItems.length === 0) {
      this.setState({ itemQuanitity: 0 });
    } else {
      this.props.cartItems.forEach((item) => {
        finalQuantity += item.amount;
        this.setState({ itemQuanitity: finalQuantity });
      });
    }
  }

  changeFromCurrencyToSymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";

      case "JPY":
        return "¥";

      case "AUD":
        return "A$";

      case "GBP":
        return "£";

      case "RUB":
        return "₽";
      default:
        return null;
    }
  };
  render() {
    //destructuring
    const { categoriesNames, loading } = this.state;
    const { location } = this.props;
    //variable that contains the pathname
    const path = location.pathname;
    if (!loading) {
      return (
        <nav>
          <ul>
            {/* dynamically display the categories to the navbar into Navlinks */}
            {categoriesNames.map((category, index) => (
              <NavLink
                key={index}
                activeClassName="active-nav-link"
                to={"/" + category}
              >
                <li>{category}</li>
              </NavLink>
            ))}
          </ul>
          <img src={brand} alt="brand logo" className="brand-image" />
          <div className="nav-end">
            <div
              className="custom-select"
              tabIndex="1"
              onClick={() => {
                this.setState((prevState) => {
                  return {
                    displayCurrencies: !prevState.displayCurrencies,
                  };
                });
              }}
              onBlur={() => {
                this.setState({ displayCurrencies: false });
              }}
            >
              <span className="custom-arrow">
                {this.props.currencySymbol}
                <img
                  src={this.state.displayCurrencies ? arrowup : arrowdwn}
                  alt="arrow"
                />
              </span>
              {this.state.displayCurrencies && (
                <div className="options">
                  {this.state.currencies.map((currency, i) => (
                    <div
                      className="options-item"
                      key={i}
                      onClick={(e) => {
                        this.props.changeCurrencySymbol(
                          this.changeFromCurrencyToSymbol(currency)
                        );
                        this.props.changeCurrency(currency);
                      }}
                    >
                      {this.changeFromCurrencyToSymbol(currency)} {currency}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <img
                src={cart}
                alt="cart"
                className="cart-image"
                onClick={() => {
                  if (path !== "/cart") {
                    this.props.toggleCart();
                  }
                }}
              />

              {this.state.itemQuanitity !== 0 && (
                <div className="number-of-items">
                  {this.state.itemQuanitity}
                </div>
              )}
            </div>
          </div>
          {this.props.showCart && <Cart size="small" />}
        </nav>
      );
    } else {
      return <></>;
    }
  }
  //updating everytime a product is added of the total price
  componentDidUpdate(prevProps) {
    if (this.props.cartItems !== prevProps.cartItems) {
      this.settingTotalQuantity();
    }
  }
}

Navbar.propTypes = {
  cartItems: PropTypes.array.isRequired,
  showCart: PropTypes.bool.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  toggleCart: PropTypes.func.isRequired,
  hideCart: PropTypes.func.isRequired,
  changeCurrency: PropTypes.func.isRequired,
  changeCurrencySymbol: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cartItems: state.cartItems,
  showCart: state.showCart,
  currencySymbol: state.currencySymbol,
});

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCart: () => {
      dispatch(toggleCart());
    },
    hideCart: () => {
      dispatch(hideCart());
    },
    changeCurrency: (currency) => {
      dispatch({ type: CHANGE_CURRENCY, payload: currency });
    },
    changeCurrencySymbol: (currencySymbol) => {
      dispatch({ type: CHANGE_CURRENCY_SYMBOL, payload: currencySymbol });
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
