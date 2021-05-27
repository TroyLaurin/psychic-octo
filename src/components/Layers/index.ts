import { ISagaModule } from "redux-dynamic-modules-saga";
import elementsReducer, { ElementsState, elementsSaga } from "./elements";
import ElementsBoard from "./ElementsBoard";

export interface LayersState {
  elements: ElementsState;
}

export const LayerModule: ISagaModule<LayersState> = {
  id: "layers",
  reducerMap: {
    elements: elementsReducer,
  },
  sagas: [elementsSaga],
  // initialActions: [],
  // finalActions: [],
};

export default ElementsBoard;
