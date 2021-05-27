import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { put, select, takeEvery } from "redux-saga/effects";
import { TICK_EVENT, CoreState } from "../Core";

export interface ElementState {
  value: number;
  max: number;
}

export interface ElementGenerator {
  src?: string;
  srcPerSecond?: number;
  dst?: string;
  dstPerSecond?: number;
}

export type ElementsState = {
  last: DOMHighResTimeStamp;
  will: ElementState;
  air: ElementState;
  earth: ElementState;
  fire: ElementState;
  water: ElementState;
  generators: Array<ElementGenerator>;
};

const initialState: ElementsState = {
  last: -1,
  will: { value: 0.0, max: 100.0 },
  air: { value: 0.0, max: 10.0 },
  earth: { value: 0.0, max: 10.0 },
  water: { value: 0.0, max: 10.0 },
  fire: { value: 0.0, max: 10.0 },
  generators: [
    { dst: "will", dstPerSecond: 10.0 },
    { src: "air", srcPerSecond: 0.1 },
    { src: "earth", srcPerSecond: 0.1 },
    { src: "fire", srcPerSecond: 0.1 },
    { src: "water", srcPerSecond: 0.1 },
  ],
};

export const GEN_COST = 10.0;

function applyGen(dt: number) {
  return (acc: ElementsState, gen: ElementGenerator) => {
    if (gen.src && gen.srcPerSecond) {
      const srcRed = Math.min(acc[gen.src].value, dt * gen.srcPerSecond);
      acc[gen.src].value -= srcRed;
      acc[gen.dst].value += (gen.dstPerSecond * srcRed) / gen.srcPerSecond;
    } else {
      acc[gen.dst] += dt * gen.dstPerSecond;
    }
    return acc;
  };
}

const elementsSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {
    load(state, action: PayloadAction<ElementsState>) {
      state = action.payload;
    },
    forceGen(state, action: PayloadAction<string>) {
      if (state.will.value < GEN_COST) return;

      const element = action.payload;

      state.will.value -= GEN_COST;
      state[element].value = Math.min(
        state[element].max,
        state[element].value + 1.0,
      ); // TODO variable
    },
    onTick(state, action: PayloadAction<DOMHighResTimeStamp>) {
      const dt = action.payload - state.last;
      const doTick = dt > 0 && state.last > 0;
      state.last = action.payload;
      if (doTick) {
        for (const gen of state.generators) {
          if (gen.src && gen.srcPerSecond) {
            const srcRed = Math.min(
              state[gen.src].value,
              dt * gen.srcPerSecond,
            );
            state[gen.src].value -= srcRed;
            if (gen.dst && gen.dstPerSecond) {
              state[gen.dst].value = Math.min(
                state[gen.dst].max,
                state[gen.dst].value +
                  (gen.dstPerSecond * srcRed) / gen.srcPerSecond,
              );
            }
          } else {
            state[gen.dst].value = Math.min(
              state[gen.dst].max,
              state[gen.dst].value + dt * gen.dstPerSecond,
            );
          }
        }
      }
    },
  },
});

export const { load, forceGen, onTick } = elementsSlice.actions;

export default elementsSlice.reducer;

export function* layerTick() {
  const time: DOMHighResTimeStamp = yield select(
    (state: CoreState) => state.time.timeNow,
  );
  yield put(onTick(time));
}

export function* elementsSaga() {
  yield takeEvery(TICK_EVENT, layerTick);
}
