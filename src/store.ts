import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import rootReducer from "./rootReducer";

const store  = configureStore({
    reducer: rootReducer
})

type AppDispatch = typeof store.dispatch;

export const useStoreDispatch = () =>  useDispatch<AppDispatch>();
export default store;