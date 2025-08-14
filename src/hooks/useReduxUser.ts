'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
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
} from '@/store/slices/userSlice';
import type { SafeUser } from '@/type/SafeUser';

export const useReduxUser = () => {
  const dispatch = useAppDispatch();
  const {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    preferences,
    wishlist,
    recentlyViewed,
  } = useAppSelector((state) => state.user);

  const handleSetCurrentUser = useCallback(
    (user: SafeUser | null) => {
      dispatch(setCurrentUser(user));
    },
    [dispatch]
  );

  const handleSetLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  const handleSetError = useCallback(
    (error: string | null) => {
      dispatch(setError(error));
    },
    [dispatch]
  );

  const handleSetTheme = useCallback(
    (theme: 'light' | 'dark') => {
      dispatch(setTheme(theme));
    },
    [dispatch]
  );

  const handleSetLanguage = useCallback(
    (language: string) => {
      dispatch(setLanguage(language));
    },
    [dispatch]
  );

  const handleSetNotifications = useCallback(
    (notifications: boolean) => {
      dispatch(setNotifications(notifications));
    },
    [dispatch]
  );

  const handleAddToWishlist = useCallback(
    (productId: string) => {
      dispatch(addToWishlist(productId));
    },
    [dispatch]
  );

  const handleRemoveFromWishlist = useCallback(
    (productId: string) => {
      dispatch(removeFromWishlist(productId));
    },
    [dispatch]
  );

  const handleSetWishlist = useCallback(
    (productIds: string[]) => {
      dispatch(setWishlist(productIds));
    },
    [dispatch]
  );

  const handleAddToRecentlyViewed = useCallback(
    (productId: string) => {
      dispatch(addToRecentlyViewed(productId));
    },
    [dispatch]
  );

  const handleClearRecentlyViewed = useCallback(() => {
    dispatch(clearRecentlyViewed());
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    preferences,
    wishlist,
    recentlyViewed,
    setCurrentUser: handleSetCurrentUser,
    setLoading: handleSetLoading,
    setError: handleSetError,
    setTheme: handleSetTheme,
    setLanguage: handleSetLanguage,
    setNotifications: handleSetNotifications,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    setWishlist: handleSetWishlist,
    addToRecentlyViewed: handleAddToRecentlyViewed,
    clearRecentlyViewed: handleClearRecentlyViewed,
    logout: handleLogout,
  };
};


