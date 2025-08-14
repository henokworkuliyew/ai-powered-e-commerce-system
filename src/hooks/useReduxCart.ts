'use client';

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setPaymentIntent,
  loadCartFromStorage,
} from '@/store/slices/cartSlice';
import type { CartProduct } from '@/type/CartProduct';
import { toast } from 'react-hot-toast';

export const useReduxCart = () => {
  const dispatch = useAppDispatch();
  const { items: cartProducts, totalQty, paymentIntent, isLoading, error } = useAppSelector(
    (state) => state.cart
  );
  
  const isInitialized = useRef(false);
  const previousCartLength = useRef(0);
  const previousCartHash = useRef('');

  // Memoize cart hash to prevent unnecessary re-renders
  const cartHash = useMemo(() => {
    return JSON.stringify(cartProducts.map(item => ({ id: item._id, qty: item.qty })));
  }, [cartProducts]);

  // Load cart from localStorage on mount (only once)
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized.current) {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          dispatch(loadCartFromStorage(parsedCart));
        }
        isInitialized.current = true;
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        isInitialized.current = true;
      }
    }
  }, [dispatch]);

  // Save cart to localStorage whenever it changes (but prevent infinite loops)
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized.current) {
      const currentCartLength = cartProducts.length;
      const currentCartHash = cartHash;
      
      // Only save if cart actually changed
      if (currentCartLength !== previousCartLength.current || 
          currentCartHash !== previousCartHash.current) {
        localStorage.setItem('cart', JSON.stringify(cartProducts));
        previousCartLength.current = currentCartLength;
        previousCartHash.current = currentCartHash;
      }
    }
  }, [cartProducts, cartHash]);

  // Load payment intent from localStorage (only once)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const gulitPaymentIntent = localStorage.getItem('gulitPaymentIntent');
        const paymentIntent: string | null = gulitPaymentIntent
          ? JSON.parse(gulitPaymentIntent)
          : null;
        dispatch(setPaymentIntent(paymentIntent));
      } catch (error) {
        console.error('Error loading payment intent from localStorage:', error);
      }
    }
  }, [dispatch]);

  const handleAddProductToCart = useCallback(
    (product: CartProduct) => {
      dispatch(addToCart(product));
      toast.success('Product added to cart!');
    },
    [dispatch]
  );

  const handleRemoveProductFromCart = useCallback(
    (productId: string) => {
      dispatch(removeFromCart(productId));
      toast.success('Product removed from cart!');
    },
    [dispatch]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, qty: number) => {
      dispatch(updateQuantity({ productId, qty }));
    },
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      localStorage.removeItem('gulitPaymentIntent');
      previousCartLength.current = 0;
      previousCartHash.current = '';
    }
    toast.success('Cart cleared!');
  }, [dispatch]);

  return {
    cartProducts,
    cartTotalQty: totalQty,
    paymentIntent,
    isLoading,
    error,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleUpdateQuantity,
    clearCart: handleClearCart,
  };
};
