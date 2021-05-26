import React, { Component, ReactElement } from "react";
import HelloWorld from "components/HelloWorld";
import { createStore } from "redux-dynamic-modules-core";
import { getSagaExtension } from "redux-dynamic-modules-saga";

class Game extends Component {
  store: any;
  constructor(props) {
    super(props);

    this.state = {};

    this.store = createStore({
      enhancers: [],
      extensions: [getSagaExtension()],
    });
  }

  render(): ReactElement {
    return (
      <>
        <HelloWorld />
      </>
    );
  }
}

export default Game;
