import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isSidebarOpen: boolean;
  isSearchModalOpen: boolean;
  isCartModalOpen: boolean;
  isWishlistModalOpen: boolean;
  isProductModalOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  loadingStates: {
    [key: string]: boolean;
  };
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  isSidebarOpen: false,
  isSearchModalOpen: false,
  isCartModalOpen: false,
  isWishlistModalOpen: false,
  isProductModalOpen: false,
  notifications: [],
  loadingStates: {},
  theme: 'light',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSearchModal: (state) => {
      state.isSearchModalOpen = !state.isSearchModalOpen;
    },
    setSearchModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchModalOpen = action.payload;
    },
    toggleCartModal: (state) => {
      state.isCartModalOpen = !state.isCartModalOpen;
    },
    setCartModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartModalOpen = action.payload;
    },
    toggleWishlistModal: (state) => {
      state.isWishlistModalOpen = !state.isWishlistModalOpen;
    },
    setWishlistModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWishlistModalOpen = action.payload;
    },
    toggleProductModal: (state) => {
      state.isProductModalOpen = !state.isProductModalOpen;
    },
    setProductModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isProductModalOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      id: string;
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
      duration?: number;
    }>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoadingState: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loadingStates[action.payload.key] = action.payload.loading;
    },
    clearLoadingStates: (state) => {
      state.loadingStates = {};
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSearchModal,
  setSearchModalOpen,
  toggleCartModal,
  setCartModalOpen,
  toggleWishlistModal,
  setWishlistModalOpen,
  toggleProductModal,
  setProductModalOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoadingState,
  clearLoadingStates,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;



