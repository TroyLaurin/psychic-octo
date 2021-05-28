import { call, delay, put } from "redux-saga/effects";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TimeState = {
  pageOpen: DOMHighResTimeStamp;
  last: DOMHighResTimeStamp;
  now: DOMHighResTimeStamp;

  gameAge: number;
};

const initialState: TimeState = {
  pageOpen: performance.now(),
  last: -1,
  now: -1,

  gameAge: 0,
};

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    load(state, action: PayloadAction<TimeState>) {
      state = { ...action.payload };
      state.pageOpen = state.last = state.now = performance.now();
    },
    tick(state, action: PayloadAction<DOMHighResTimeStamp>) {
      state.gameAge += action.payload - state.now;
      state.last = state.now;
      state.now = action.payload;
    },
  },
});

export const { load, tick } = timeSlice.actions;

export function* timeSaga() {
  while (true) {
    yield delay(16);
    const ts: DOMHighResTimeStamp = yield call(
      () => performance.now() / 1000.0,
    );
    yield put(tick(ts));
  }
}

export default timeSlice.reducer;
