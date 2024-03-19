import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import gameSlice from "./gameSlice"

export const store = configureStore({
    reducer: { 
        game: gameSlice
    }
})

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector