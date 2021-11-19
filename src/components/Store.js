import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query, client } from "@tilework/opus";
import { connect } from "react-redux";
import { getProducts } from "../actions/products";
import { hideCart } from "../actions/showCart";
//import components
import Product from "./Product";

//specify the endpoint
client.setEndpoint("http://localhost:4000/");

//create the categories' names query
const getCategsQuery = new Query("categories", true).addFieldList(["name"]);

class Store extends Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      loading: true,
    };
  }
  componentDidMount() {
    const categsData = client.post(getCategsQuery);
    // fetching categories and setting them in state
    categsData.then((data) => {
      let arr = [];
      data.categories.forEach((category) => {
        arr.push(category.name);
      });
      this.setState({
        categories: [...this.state.categories, ...arr],
        loading: false,
      });
    });
    this.props.getProducts();
  }
  render() {
    const title = this.props.match.params.title;
    //rendering store based on category using react router params
    if (this.state.categories.includes(title)) {
      return (
        <div style={{ position: "relative" }}>
          <div className="store-container">
            <h1
              style={{
                textTransform: "capitalize",
                paddingTop: "3rem",
                margin: "0",
              }}
            >
              {title}
            </h1>
            <div id="products-container">
              {this.props.products.map(
                (product) =>
                  product.category === title && (
                    <Product key={product.id} product={product} />
                  )
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <h1>Sorry, we couldn't find the page you were looking for :/</h1>
        </>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  products: state.products,
  showCart: state.showCart,
});

export default connect(mapStateToProps, { getProducts, hideCart })(
  withRouter(Store)
);
