import { ISagaModule } from "redux-dynamic-modules-saga";
import timeReducer, { timeSaga, TimeState } from "./time";

export interface CoreState {
  time: TimeState;
}

export function getCoreModule(): ISagaModule<CoreState> {
  return {
    id: "core",
    reducerMap: {
      time: timeReducer,
    },
    sagas: [timeSaga],
    // initialActions: [],
    // finalActions: [],
  };
}
