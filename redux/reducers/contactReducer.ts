import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
    contacts: any[]
    contactsSearch: any[],
    count: number
}

const initialState: initialStateType = {
    contacts: [],
    contactsSearch: [],
    count: 0
}

export const contactsReducer = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        setContacts(state, action: PayloadAction<any[]>) {
            state.contacts = action.payload;
        },
        setContactsCount(state, action: PayloadAction<number>) {
            state.count = action.payload
        },
    }
})

export const { setContacts, setContactsCount } = contactsReducer.actions;
