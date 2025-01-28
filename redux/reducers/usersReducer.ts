import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
    users: any[]
    usersSearch: any[],
    order: any[]
    count: number,
    isLastPage: boolean
}

const initialState: initialStateType = {
    users: [],
    usersSearch: [],
    order: [],
    count: 0,
    isLastPage: false
}

export const usersReducer = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<any[]>) {
            state.users = action.payload;
        },
        setSearchUsers(state, action: PayloadAction<any[]>) {
            state.usersSearch = action.payload;
        },
        setUsersCount(state, action: PayloadAction<number>) {
            state.count = action.payload
        },
        setIsLastPage(state, action: PayloadAction<boolean>) {
            state.isLastPage = action.payload;
        }
    }
})

export const { setUsers, setSearchUsers, setUsersCount, setIsLastPage } = usersReducer.actions;
