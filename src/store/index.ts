import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import todoReducer from './slices/todoSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer,
    cart: cartReducer,
    products: productReducer,
    user: userReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
