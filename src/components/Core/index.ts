import { ISagaModule } from "redux-dynamic-modules-saga";
import timeReducer, { tick, timeSaga, TimeState } from "./time";

export const TICK_EVENT = tick(0).type;

export interface CoreState {
  time: TimeState;
}

export const CoreModule: ISagaModule<CoreState> = {
  id: "core",
  reducerMap: {
    time: timeReducer,
  },
  sagas: [timeSaga],
  // initialActions: [],
  // finalActions: [],
};
