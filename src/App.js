import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

// import components
import Store from "./components/Store";
import Item from "./components/Item";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import Overlay from "./components/Overlay";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <Navbar />
          <Overlay />
          <Switch>
            <Route exact path="/">
              <Store />
            </Route>
            <Route exact path="/cart">
              <Cart size="large" />
            </Route>
            <Route exact path="/:title">
              <Store />
            </Route>
            <Route exact path="/item/:itemId">
              <Item />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
