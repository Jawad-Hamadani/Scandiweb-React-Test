import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import brand from "../icons/brand.png";
import cart from "../icons/cart.png";
import { Query, client } from "@tilework/opus";
import arrowdwn from "../icons/arrowdwn.png";
import arrowup from "../icons/arrowup.png";
import { CHANGE_CURRENCY } from "../actions/actionTypes";
import { connect } from "react-redux";
import { toggleCart } from "../actions/showCart";
import Cart from "./Cart";
import { hideCart } from "../actions/showCart";

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
      selected: false,
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
  render() {
    //destructuring
    const { categoriesNames, loading } = this.state;
    const { cartItems, location } = this.props;
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
            <div className="custom-select">
              <select
                onChange={(e) => this.props.changeCurrency(e.target.value)}
                onClick={() => {
                  this.setState((prevState) => ({
                    selected: !prevState.selected,
                  }));
                }}
                onBlur={() => {
                  this.setState(() => ({
                    selected: false,
                  }));
                }}
                name="currency"
                id="currency"
              >
                {/* dynamically spawn currencies based on the result 
                of the currency query that has been fetched */}
                {this.state.currencies.map((currency, i) => (
                  <option key={i} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <span className="custom-arrow">
                ${" "}
                <img
                  style={{ marginLeft: "0.1rem" }}
                  src={this.state.selected ? arrowup : arrowdwn}
                  alt="arrow"
                />{" "}
              </span>
            </div>
            <div style={{ position: "relative" }}>
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

              {cartItems.length !== 0 && (
                <div className="number-of-items">{cartItems.length}</div>
              )}
            </div>
          </div>
          <Cart size="small" />
        </nav>
      );
    } else {
      return <></>;
    }
  }
}
const mapStateToProps = (state) => ({
  cartItems: state.cartItems,
  showCart: state.showCart,
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
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
