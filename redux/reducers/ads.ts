import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
    ads: any[]
    adsSearch: any[],
    isLastPage: boolean,
}

const initialState: initialStateType = {
    ads: [],
    adsSearch: [],
    isLastPage: false,
}
export const adsSlice = createSlice({
    name: 'ads',
    initialState,
    reducers: {
        setAds(state, action: PayloadAction<any[]>) {
            state.ads = action.payload
        },
        addAds(state, action: PayloadAction<any>) {
            state.ads.push(action.payload)
        },
        updateAds(state, action: PayloadAction<any>) {
            const index = state.ads.findIndex(i => i.id === action.payload.id)
            state.ads[index] = { ...action.payload }
        },
        deleteAds(state, action: PayloadAction<any>) {
            state.ads = state.ads.filter(i => i.id !== action.payload)
        },
    }
})

export const { setAds, addAds, updateAds, deleteAds } = adsSlice.actions
