import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = {
  id: number;
  name: string;
};

export type User = {
  email: string;
  fullname: string;
  id: string;
  imageUrl: string | null;
  phone: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  passwordLastUpdated?: string;
  lastLoginAt?: string;
  Address?: any[];
  isActive?: boolean;
  lang?: string;
  isConfirmed?: boolean;
  birthDate: string;
  gender: string;
};

type InitialStateType = {
  users: User[];
  usersSearch: User[];
  order: any[];
  count: number;
  isLastPage: boolean;
};

const initialState: InitialStateType = {
  users: [],
  usersSearch: [],
  order: [],
  count: 0,
  isLastPage: false,
};

export const usersReducer = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    setSearchUsers(state, action: PayloadAction<User[]>) {
      state.usersSearch = action.payload;
    },
    setUsersCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    setIsLastPage(state, action: PayloadAction<boolean>) {
      state.isLastPage = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    updateUser(state, action: PayloadAction<User>) {
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? { ...user, ...action.payload } : user
      );
    },
  },
});

export const {
  setUsers,
  setSearchUsers,
  setUsersCount,
  setIsLastPage,
  addUser,
  updateUser,
  deleteUser,
} = usersReducer.actions;
