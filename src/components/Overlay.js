import React, { Component } from "react";
import { connect } from "react-redux";
import { hideCart } from "../actions/showCart";
import PropTypes from "prop-types";

export class Overlay extends Component {
  render() {
    const { showCart, hideCart } = this.props;
    //conditionaly render a dark background with half opacity when cart is to be shown
    return (
      <div
        onClick={() => {
          hideCart();
        }}
        className={showCart ? "cart-background" : " hide-item"}
      ></div>
    );
  }
}

Overlay.propTypes = {
  showCart: PropTypes.bool.isRequired,
  hideCart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  showCart: state.showCart,
});

export default connect(mapStateToProps, { hideCart })(Overlay);
