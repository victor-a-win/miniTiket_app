import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore  } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./features/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
  version: 1,
  migrate: (state: any) => {
    if (state && state._persist.version !== 1) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(state);
  },
};

const persistedReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;


