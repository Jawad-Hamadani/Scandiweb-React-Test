import React, { Component } from "react";
import { connect } from "react-redux";
import { hideCart } from "../actions/showCart";

export class Overlay extends Component {
  render() {
    //conditionaly render a dark background with half opacity when cart is to be shown
    return (
      <div
        onClick={() => {
          this.props.hideCart();
        }}
        className={this.props.showCart ? "cart-background" : " hide-item"}
      ></div>
    );
  }
}
const mapStateToProps = (state) => ({
  showCart: state.showCart,
});

export default connect(mapStateToProps, { hideCart })(Overlay);
