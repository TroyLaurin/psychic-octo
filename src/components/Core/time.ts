import { call, delay, put } from "redux-saga/effects";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TimeState = {
  timeStart: DOMHighResTimeStamp;
  timePrevious: DOMHighResTimeStamp;
  timeNow: DOMHighResTimeStamp;
};

const initialState: TimeState = {
  timeStart: performance.now(),
  timePrevious: -1,
  timeNow: -1,
};

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    tick(state, action: PayloadAction<DOMHighResTimeStamp>) {
      state.timePrevious = state.timeNow;
      state.timeNow = action.payload;
    },
  },
});

export const { tick } = timeSlice.actions;

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
