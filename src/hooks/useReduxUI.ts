'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
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
} from '@/store/slices/uiSlice';

export const useReduxUI = () => {
  const dispatch = useAppDispatch();
  const {
    isSidebarOpen,
    isSearchModalOpen,
    isCartModalOpen,
    isWishlistModalOpen,
    isProductModalOpen,
    notifications,
    loadingStates,
    theme,
  } = useAppSelector((state) => state.ui);

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleSetSidebarOpen = useCallback(
    (open: boolean) => {
      dispatch(setSidebarOpen(open));
    },
    [dispatch]
  );

  const handleToggleSearchModal = useCallback(() => {
    dispatch(toggleSearchModal());
  }, [dispatch]);

  const handleSetSearchModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setSearchModalOpen(open));
    },
    [dispatch]
  );

  const handleToggleCartModal = useCallback(() => {
    dispatch(toggleCartModal());
  }, [dispatch]);

  const handleSetCartModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setCartModalOpen(open));
    },
    [dispatch]
  );

  const handleToggleWishlistModal = useCallback(() => {
    dispatch(toggleWishlistModal());
  }, [dispatch]);

  const handleSetWishlistModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setWishlistModalOpen(open));
    },
    [dispatch]
  );

  const handleToggleProductModal = useCallback(() => {
    dispatch(toggleProductModal());
  }, [dispatch]);

  const handleSetProductModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setProductModalOpen(open));
    },
    [dispatch]
  );

  const handleAddNotification = useCallback(
    (notification: {
      id: string;
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
      duration?: number;
    }) => {
      dispatch(addNotification(notification));
    },
    [dispatch]
  );

  const handleRemoveNotification = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const handleClearNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const handleSetLoadingState = useCallback(
    (key: string, loading: boolean) => {
      dispatch(setLoadingState({ key, loading }));
    },
    [dispatch]
  );

  const handleClearLoadingStates = useCallback(() => {
    dispatch(clearLoadingStates());
  }, [dispatch]);

  const handleSetTheme = useCallback(
    (theme: 'light' | 'dark') => {
      dispatch(setTheme(theme));
    },
    [dispatch]
  );

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return {
    isSidebarOpen,
    isSearchModalOpen,
    isCartModalOpen,
    isWishlistModalOpen,
    isProductModalOpen,
    notifications,
    loadingStates,
    theme,
    toggleSidebar: handleToggleSidebar,
    setSidebarOpen: handleSetSidebarOpen,
    toggleSearchModal: handleToggleSearchModal,
    setSearchModalOpen: handleSetSearchModalOpen,
    toggleCartModal: handleToggleCartModal,
    setCartModalOpen: handleSetCartModalOpen,
    toggleWishlistModal: handleToggleWishlistModal,
    setWishlistModalOpen: handleSetWishlistModalOpen,
    toggleProductModal: handleToggleProductModal,
    setProductModalOpen: handleSetProductModalOpen,
    addNotification: handleAddNotification,
    removeNotification: handleRemoveNotification,
    clearNotifications: handleClearNotifications,
    setLoadingState: handleSetLoadingState,
    clearLoadingStates: handleClearLoadingStates,
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,
  };
};





