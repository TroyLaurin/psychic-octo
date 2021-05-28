import { ISagaModule } from "redux-dynamic-modules-saga";
import loreReducer, { NEW_LORE, LoreState, loreSaga } from "./lore";
import timeReducer, { tick, timeSaga, TimeState } from "./time";

import Lore from "./LoreUI";

export const TICK_EVENT = tick(0).type;

export const newLore = (text: string) => ({
  type: NEW_LORE,
  payload: text,
});

export interface CoreState {
  lore: LoreState;
  time: TimeState;
}

export const CoreModule: ISagaModule<CoreState> = {
  id: "core",
  reducerMap: {
    time: timeReducer,
    lore: loreReducer,
  },
  sagas: [timeSaga, loreSaga],
  // initialActions: [],
  // finalActions: [],
};

export default Lore;
