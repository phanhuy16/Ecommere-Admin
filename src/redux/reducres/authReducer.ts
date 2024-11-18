
import { localDataNames } from "@/constants/appInfo";
import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string,
  refreshToken: string,
}

const initialState = {
  accessToken: '',
  refreshToken: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: initialState
  }, reducers: {
    addAuth: (state, action) => {
      state.data = action.payload;
      syncLocal(action.payload);
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeAuth: (state, _action) => {
      state.data = initialState;
      syncLocal({});
    }
  }
})

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;

export const authSeletor = (state: any) => state.authReducer.data;

const syncLocal = (data: any) => {
  localStorage.setItem(
    localDataNames.jwt,
    JSON.stringify(data)
  );
}