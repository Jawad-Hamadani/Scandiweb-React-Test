import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query, client, Field } from "@tilework/opus";

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
      products: [],
      loading: true,
    };
  }
  //create categories'query based on the match.param and fetch each category's items
  getCategsProducts = async (categoryName) => {
    const productQuery = new Query("category", true)
      .addArgument("input", "CategoryInput", categoryName)
      .addField(
        new Field("products")
          .addFieldList([
            "name",
            "id",
            "inStock",
            "category",
            "gallery",
            "description",
            "brand",
          ])
          .addField(new Field("prices").addFieldList(["currency", "amount"]))
      );

    const res = await client.post(productQuery);
    this.setState({ products: [...res.category.products], loading: false });
  };

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
      });
    });
    //fetching products based on categories
    this.getCategsProducts({ title: this.props.match.params.title });
  }

  render() {
    const { title } = this.props.match.params;
    //rendering store based on category using react router params
    if (this.state.categories.includes(title)) {
      if (this.state.loading) {
        return <h1>Loading...</h1>;
      } else {
        return (
          <div className="relative">
            <div className="store-container">
              <h1>{title}</h1>
              <div id="products-container">
                {this.state.products.map(
                  (product) =>
                    product.category === title && (
                      <Product key={product.id} product={product} />
                    )
                )}
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <>
          <h1>Sorry, we couldn't find the page you were looking for :/</h1>
        </>
      );
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.title !== prevProps.match.params.title) {
      this.getCategsProducts({ title: this.props.match.params.title });
    }
  }
}

export default withRouter(Store);
