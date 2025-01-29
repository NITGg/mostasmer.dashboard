import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Badge type definition
export type Badge = {
  id: number;
  name: string;
  points: number;
  minAmount: number;
  maxAmount: number;
  cover: string;
  logo: string;
  color?: string;
  users?: number;
  validFrom?: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
};

// State type for badges
type BadgesState = {
  badges: Badge[];
  isLastPage: boolean;
  badgeById: Badge | null;
  lastDoc: any; // For pagination or other state tracking
};

// Initial state
const initialState: BadgesState = {
  badges: [],
  isLastPage: false,
  badgeById: null,
  lastDoc: null,
};

// Create slice for badges
export const badgesSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {
    // Set all badges
    setBadges(state, action: PayloadAction<Badge[]>) {
      state.badges = action.payload;
    },

    // Set if it's the last page of badges
    setIsLastPage(state, action: PayloadAction<boolean>) {
      state.isLastPage = action.payload;
    },

    // Find a badge by ID
    getBadgeById(state, action: PayloadAction<number>) {
      const badge = state.badges.find((badge) => badge.id === action.payload);
      state.badgeById = badge || null;
    },

    // Add a new badge
    addBadge(state, action: PayloadAction<Badge>) {
      state.badges.push(action.payload);
    },

    // Update an existing badge
    updateBadge(state, action: PayloadAction<Badge>) {
      const index = state.badges.findIndex(
        (badge) => badge.id === action.payload.id
      );
      if (index !== -1) {
        state.badges[index] = action.payload;
      }
    },

    // Delete a badge by ID
    deleteBadge(state, action: PayloadAction<number>) {
      state.badges = state.badges.filter(
        (badge) => badge.id !== action.payload
      );
    },

    // Set the last document (useful for pagination or querying)
    setLastDoc(state, action: PayloadAction<any>) {
      state.lastDoc = action.payload;
    },
  },
});

// Export actions for use in components or middleware
export const {
  setBadges,
  setIsLastPage,
  getBadgeById,
  addBadge,
  updateBadge,
  deleteBadge,
  setLastDoc,
} = badgesSlice.actions;

// Export reducer for store configuration
export default badgesSlice.reducer;
