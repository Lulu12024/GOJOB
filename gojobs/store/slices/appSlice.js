import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offers: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOffers: (state, action) => {
      state.offers = action.payload;
    },
  },
});

export const { setOffers, } = appSlice.actions;
export default appSlice.reducer;
