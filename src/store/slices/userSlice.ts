import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SafeUser } from '@/type/SafeUser';

interface UserState {
  currentUser: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
  wishlist: string[]; // Product IDs
  recentlyViewed: string[]; // Product IDs
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: true,
  },
  wishlist: [],
  recentlyViewed: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<SafeUser | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.preferences.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.preferences.language = action.payload;
    },
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.preferences.notifications = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter(id => id !== action.payload);
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.wishlist = action.payload;
    },
    addToRecentlyViewed: (state, action: PayloadAction<string>) => {
      // Remove if already exists and add to front
      state.recentlyViewed = state.recentlyViewed.filter(id => id !== action.payload);
      state.recentlyViewed.unshift(action.payload);
      // Keep only last 10 items
      if (state.recentlyViewed.length > 10) {
        state.recentlyViewed = state.recentlyViewed.slice(0, 10);
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.wishlist = [];
      state.recentlyViewed = [];
    },
  },
});

export const {
  setCurrentUser,
  setLoading,
  setError,
  setTheme,
  setLanguage,
  setNotifications,
  addToWishlist,
  removeFromWishlist,
  setWishlist,
  addToRecentlyViewed,
  clearRecentlyViewed,
  logout,
} = userSlice.actions;

export default userSlice.reducer;



