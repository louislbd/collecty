import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StoreState {
    token: string | null;
    user_id: string | null;
}

const initialState: StoreState = {
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<StoreState>) => {
            state.token = action.payload.token;
            state.user_id = action.payload.user_id;
            localStorage.setItem("token", action.payload.token as string);
            localStorage.setItem("user_id", action.payload.user_id as string);
        },

        setLogout: (state) => {
            state.token = null;
            state.user_id = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
        },
    },
});

export const { setToken, setLogout } = authSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
