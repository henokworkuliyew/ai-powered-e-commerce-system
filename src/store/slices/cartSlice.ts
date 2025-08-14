import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartProduct } from '@/type/CartProduct';

interface CartState {
  items: CartProduct[];
  totalQty: number;
  paymentIntent: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalQty: 0,
  paymentIntent: null,
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
      state.totalQty = state.items.reduce((total, item) => total + item.qty, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.totalQty = state.items.reduce((total, item) => total + item.qty, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; qty: number }>) => {
      const item = state.items.find(item => item._id === action.payload.productId);
      if (item) {
        item.qty = action.payload.qty;
        state.totalQty = state.items.reduce((total, item) => total + item.qty, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQty = 0;
      state.paymentIntent = null;
    },
    setPaymentIntent: (state, action: PayloadAction<string | null>) => {
      state.paymentIntent = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loadCartFromStorage: (state, action: PayloadAction<CartProduct[]>) => {
      state.items = action.payload;
      state.totalQty = action.payload.reduce((total, item) => total + item.qty, 0);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setPaymentIntent,
  setLoading,
  setError,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;


