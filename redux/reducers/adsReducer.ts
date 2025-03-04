import { Brand } from "@/components/users/BrandSelect";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum AdsStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum AdsPlacement {
  Top = "Top",
  Middle = "Middle",
  Bottom = "Bottom",
}

export enum AdsType {
  Home = "Home",
  Popup = "Popup",
}

export enum AdsFrequency {
  Once = "Once",
  Daily = "Daily",
  PerSession = "PerSession",
}

type AdsUserTypes = {
  id: number;
  adId?: number;
  userTypeId: number;
  userType?: { userType: string };
  startDate: Date | null;
  endDate: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type Ad = {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  priority: number;
  status: AdsStatus;
  placement?: AdsPlacement;
  adType: AdsType;
  frequency?: AdsFrequency;
  timing: number;
  closable?: boolean;
  displayDuration: number;
  userTypes: AdsUserTypes[];
  brand?: Brand;
  brandId: number;
};

type InitialStateType = {
  ads: Ad[];
  adsSearch: Ad[];
  isLastPage: boolean;
};

const initialState: InitialStateType = {
  ads: [],
  adsSearch: [],
  isLastPage: false,
};

export const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    setAds(state, action: PayloadAction<Ad[]>) {
      state.ads = action.payload;
    },
    addAds(state, action: PayloadAction<Ad>) {
      state.ads.push(action.payload);
    },
    updateAds(state, action: PayloadAction<Ad>) {
      const index = state.ads.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.ads[index] = { ...action.payload };
      }
    },
    deleteAds(state, action: PayloadAction<number>) {
      state.ads = state.ads.filter((i) => i.id !== action.payload);
    },
  },
});

export const { setAds, addAds, updateAds, deleteAds } = adsSlice.actions;
