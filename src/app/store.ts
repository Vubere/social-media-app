import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import userSlice from "../slices/userSlice";
import chatSlice from "../slices/chatSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
