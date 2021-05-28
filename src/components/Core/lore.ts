import { put, select, takeEvery } from "@redux-saga/core/effects";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeState } from "./time";

export type LoreState = {
  history: Array<LoreEntry>;
};

export type LoreEntry = {
  secondsSinceGameStart: number;
  text: string;
};

export const NEW_LORE = "lore:new";

const initialState: LoreState = {
  history: [],
};

const slice = createSlice({
  name: "lore",
  initialState,
  reducers: {
    load(state, action: PayloadAction<LoreState>) {
      state.history = action.payload.history.slice();
    },
    addLore(state, action: PayloadAction<LoreEntry>) {
      state.history.splice(0, 0, action.payload);
    },
  },
});

export const { load, addLore } = slice.actions;

export default slice.reducer;

export function* loreSaga() {
  yield takeEvery(NEW_LORE, function* (lore: PayloadAction<string>) {
    const time: TimeState = yield select((state) => state.time);
    yield put(
      addLore({
        secondsSinceGameStart: time.gameAge,
        text: lore.payload,
      }),
    );
  });
}
