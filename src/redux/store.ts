import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducres/authReducer";

const store = configureStore({
  reducer: {
    authReducer,
  }
});

export default store;