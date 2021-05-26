import React, { Component, ReactElement } from "react";
import HelloWorld from "components/HelloWorld";
import { createStore } from "redux-dynamic-modules-core";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { Provider } from "react-redux";
import { IModuleStore } from "redux-dynamic-modules";

import { getCoreModule } from "./components/Core";

class Game extends Component {
  store: IModuleStore<any>;
  constructor(props) {
    super(props);

    this.state = {};

    this.store = createStore(
      {
        enhancers: [],
        extensions: [getSagaExtension()],
      },
      getCoreModule(),
    );
  }

  render(): ReactElement {
    return (
      <Provider store={this.store}>
        <HelloWorld />
      </Provider>
    );
  }
}

export default Game;
