import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { all, delay, put, select, take, takeLatest } from "redux-saga/effects";
import { TICK_EVENT, CoreState, newLore } from "../Core";

import { Map } from "immutable";

export enum Status {
  HIDDEN,
  DISCOVERABLE,
  ACTIVE,
  PASSIVE,
}
export interface ElementState {
  status: Status;
  value: number;
  max: number;
}

export interface ElementGenerator {
  src?: string;
  srcPerSecond?: number;
  dst?: string;
  dstPerSecond?: number;
}

export interface ElementsCollection {
  will: ElementState;
  air: ElementState;
  earth: ElementState;
  fire: ElementState;
  water: ElementState;
}

export type ElementsState = {
  last: DOMHighResTimeStamp;
  elements: ElementsCollection;
  generators: Map<string, ElementGenerator>;
};

function drainGenerator(name: string, rate = 0.1): ElementGenerator {
  return { src: name, srcPerSecond: rate };
}

const initialState: ElementsState = {
  last: -1,
  elements: {
    will: { status: Status.HIDDEN, value: 0.0, max: 100.0 },
    air: { status: Status.HIDDEN, value: 0.0, max: 10.0 },
    earth: { status: Status.HIDDEN, value: 0.0, max: 10.0 },
    water: { status: Status.HIDDEN, value: 0.0, max: 10.0 },
    fire: { status: Status.HIDDEN, value: 0.0, max: 10.0 },
  },
  generators: Map(),
};

export const GEN_COST = 10.0;

// function applyGen(dt: number) {
//   return (acc: ElementsState, gen: ElementGenerator) => {
//     if (gen.src && gen.srcPerSecond) {
//       const srcRed = Math.min(acc[gen.src].value, dt * gen.srcPerSecond);
//       acc[gen.src].value -= srcRed;
//       acc[gen.dst].value += (gen.dstPerSecond * srcRed) / gen.srcPerSecond;
//     } else {
//       acc[gen.dst] += dt * gen.dstPerSecond;
//     }
//     return acc;
//   };
// }

const slice = createSlice({
  name: "elements",
  initialState,
  reducers: {
    forceGen(state, action: PayloadAction<keyof ElementsCollection>) {
      if (state.elements.will.value < GEN_COST) return;

      const name = action.payload;
      const element = state.elements[name];

      state.elements.will.value -= GEN_COST;
      element.value = Math.min(element.max, element.value + 1.0);
    },
    reinit(state, action: PayloadAction<DOMHighResTimeStamp>) {
      state.last = action.payload;
    },
    onTick(state, action: PayloadAction<DOMHighResTimeStamp>) {
      const dt = action.payload - state.last;
      state.last = action.payload;
      const elements = { ...state.elements };
      for (const gen of state.generators.values()) {
        const src = elements[gen.src];
        const dst = elements[gen.dst];
        if (src && gen.srcPerSecond) {
          const srcRed = Math.min(src.value, dt * gen.srcPerSecond);
          elements[gen.src].value -= srcRed;
          if (dst && gen.dstPerSecond) {
            elements[gen.dst].value = Math.min(
              dst.max,
              dst.value + (gen.dstPerSecond * srcRed) / gen.srcPerSecond,
            );
          }
        } else if (dst) {
          elements[gen.dst].value = Math.min(
            dst.max,
            dst.value + dt * gen.dstPerSecond,
          );
        }
      }
      state.elements = { ...elements };
    },
    story_revealWill(state) {
      console.log("Proccing story 1");
      state.elements.will.status = Status.DISCOVERABLE;
    },
    story_discoverWill(state) {
      console.log("Proccing story 2");
      state.elements.will.status = Status.PASSIVE;
      state.generators = state.generators.set("willGain", {
        dst: "will",
        dstPerSecond: 10.0,
      });
    },
    story_focusWill(state) {
      console.log("Proccing story 3");
      state.elements.air.status = Status.DISCOVERABLE;
    },
    story_discoverElements(state) {
      console.log("Proccing story 4");
      for (const x of ["air", "earth", "fire", "water"]) {
        state.elements[x].status = Status.ACTIVE;
        state.generators = state.generators.set(x + "Drain", drainGenerator(x));
      }
    },
  },
});

export const { forceGen } = slice.actions;

export default slice.reducer;

const { reinit, onTick } = slice.actions;

export const DISCOVER_WILL = "elements:will:discover";
export const FOCUS_WILL = "elements:will:focus";

function* elementsStory() {
  yield put(newLore("You are floating, formless in the void."));
  yield delay(5000);
  yield put(newLore("Formless, but you exist. How do you exist?"));
  yield delay(5000);
  yield put(
    newLore(
      "You have no form, but you have thought. " +
        "Can you gather your thoughts somehow?",
    ),
  );
  yield put(slice.actions.story_revealWill());
  yield take(DISCOVER_WILL);
  yield put(slice.actions.story_discoverWill());
  yield delay(5000);
  yield put(
    newLore(
      "Your thoughts seem to be having an effect on the void. " +
        "What will happen if you focus your will?",
    ),
  );
  yield put(slice.actions.story_focusWill());
  yield take(FOCUS_WILL);
  yield put(
    newLore(
      "Your will can bring form to the void. " +
        "You notice four distinct forms you can create, and call them <i>Elements</i>",
    ),
  );
  yield put(slice.actions.story_discoverElements());
}

export function* elementGeneration() {
  const firstTick = yield take(TICK_EVENT);
  yield put(reinit(firstTick.payload));

  yield takeLatest(TICK_EVENT, function* () {
    const now = yield select((state: CoreState) => state.time.now);
    yield put(onTick(now));
  });
}

export function* elementsSaga() {
  yield all([elementsStory(), elementGeneration()]);
}
