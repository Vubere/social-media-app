import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import userSlice from "../slices/userSlice";
import chatSlice from "../slices/chatSlice";
import feedSlice from "../slices/feedSlice";


export const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice,
    feed: feedSlice
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
