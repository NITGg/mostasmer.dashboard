import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./usersReducer";

export type GiftCard = {
  id: number;
  userFrom: User;
  userTo: User;
  QR: string;
  point: number;
  paymentamount: number | null;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  validTo: string;
  expird: boolean;
  type: string;
  walletHistoryId: number | null;
  createdAt: string;
  updatedAt: string;
};

type GiftCardsState = {
  giftCards: GiftCard[];
  isLastPage: boolean;
  giftCardById: GiftCard | null;
  lastDoc: any;
};

const initialState: GiftCardsState = {
  giftCards: [],
  isLastPage: false,
  giftCardById: null,
  lastDoc: null,
};

export const giftCardsSlice = createSlice({
  name: "giftCards",
  initialState,
  reducers: {
    setGiftCards(state, action: PayloadAction<GiftCard[]>) {
      state.giftCards = action.payload;
    },

    setIsLastPage(state, action: PayloadAction<boolean>) {
      state.isLastPage = action.payload;
    },

    getGiftCardById(state, action: PayloadAction<number>) {
      const giftCard = state.giftCards.find(
        (giftCard) => giftCard.id === action.payload
      );
      state.giftCardById = giftCard || null;
    },

    addGiftCard(state, action: PayloadAction<GiftCard>) {
      state.giftCards.push(action.payload);
    },

    updateGiftCard(state, action: PayloadAction<GiftCard>) {
      const index = state.giftCards.findIndex(
        (giftCard) => giftCard.id === action.payload.id
      );
      if (index !== -1) {
        state.giftCards[index] = action.payload;
      }
    },

    deleteGiftCard(state, action: PayloadAction<number>) {
      state.giftCards = state.giftCards.filter(
        (giftCard) => giftCard.id !== action.payload
      );
    },

    setLastDoc(state, action: PayloadAction<any>) {
      state.lastDoc = action.payload;
    },
  },
});

export const {
  setGiftCards,
  setIsLastPage,
  addGiftCard,
  updateGiftCard,
  deleteGiftCard,
  getGiftCardById,
  setLastDoc,
} = giftCardsSlice.actions;

export default giftCardsSlice.reducer;
