import React, { Component, ReactElement } from "react";
import { createStore } from "redux-dynamic-modules-core";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { Provider } from "react-redux";
import { IModuleStore } from "redux-dynamic-modules";

import { CoreModule, CoreState } from "components/Core";
import ElementsBoard, { LayerModule, LayersState } from "components/Layers";
import Lore from "components/Core";

import "./main.scss";

interface RootState extends CoreState, LayersState {}

class Game extends Component {
  store: IModuleStore<RootState>;
  constructor(props) {
    super(props);

    this.state = {};

    this.store = createStore(
      {
        enhancers: [],
        extensions: [getSagaExtension()],
      },
      CoreModule,
      LayerModule,
    );
  }

  render(): ReactElement {
    return (
      <Provider store={this.store}>
        <div className="main">
          <ElementsBoard />
        </div>
        <Lore />
      </Provider>
    );
  }
}

export default Game;
