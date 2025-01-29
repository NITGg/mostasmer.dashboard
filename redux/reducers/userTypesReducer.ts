import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Badge } from "./badgesReducer";

export type UserType = {
  id: number;
  userType: string;
  color?: string;
  buyAmount: number;
  ratio: number;
  badgeId?: number;
  badge?: Badge;
  createdAt: string;
  updatedAt: string;
};

type UserTypesState = {
  userTypes: UserType[];
  isLastPage: boolean;
  userTypeById: UserType | null;
  lastDoc: any;
};

const initialState: UserTypesState = {
  userTypes: [],
  isLastPage: false,
  userTypeById: null,
  lastDoc: null,
};

export const userTypesSlice = createSlice({
  name: "userTypes",
  initialState,
  reducers: {
    setUserTypes(state, action: PayloadAction<UserType[]>) {
      state.userTypes = action.payload;
    },

    setIsLastPage(state, action: PayloadAction<boolean>) {
      state.isLastPage = action.payload;
    },

    getUserTypeById(state, action: PayloadAction<number>) {
      const userType = state.userTypes.find(
        (userType) => userType.id === action.payload
      );
      state.userTypeById = userType || null;
    },

    addUserType(state, action: PayloadAction<UserType>) {
      state.userTypes.push(action.payload);
    },

    updateUserType(state, action: PayloadAction<UserType>) {
      const index = state.userTypes.findIndex(
        (userType) => userType.id === action.payload.id
      );
      if (index !== -1) {
        state.userTypes[index] = action.payload;
      }
    },

    // Delete a user type by ID
    deleteUserType(state, action: PayloadAction<number>) {
      state.userTypes = state.userTypes.filter(
        (userType) => userType.id !== action.payload
      );
    },

    // Set the last document (can be for pagination purposes)
    setLastDoc(state, action: PayloadAction<any>) {
      state.lastDoc = action.payload;
    },
  },
});

export const {
  setUserTypes,
  setIsLastPage,
  addUserType,
  updateUserType,
  deleteUserType,
  setLastDoc,
} = userTypesSlice.actions;
