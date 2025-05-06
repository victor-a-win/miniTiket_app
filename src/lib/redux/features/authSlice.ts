import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IUser} from "../../../interfaces/user.interface";

export interface AuthState {
  isLogin?: boolean;
  user: IUser | null;
}

const initialState: AuthState = {
  isLogin: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: IUser }>) => {
      state.isLogin = true;  
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;