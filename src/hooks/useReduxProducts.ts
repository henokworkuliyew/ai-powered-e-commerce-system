'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setProducts,
  setCurrentProduct,
  setRecommendedProducts,
  setSearchQuery,
  setSelectedCategory,
  setSelectedBrand,
  setPriceRange,
  setSortBy,
  filterProducts,
  clearFilters,
  setLoading,
  setError,
} from '@/store/slices/productSlice';
import type { Product } from '@/type/Product';

export const useReduxProducts = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    filteredProducts,
    recommendedProducts,
    currentProduct,
    searchQuery,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    isLoading,
    error,
  } = useAppSelector((state) => state.products);

  const handleSetProducts = useCallback(
    (products: Product[]) => {
      dispatch(setProducts(products));
    },
    [dispatch]
  );

  const handleSetCurrentProduct = useCallback(
    (product: Product | null) => {
      dispatch(setCurrentProduct(product));
    },
    [dispatch]
  );

  const handleSetRecommendedProducts = useCallback(
    (products: Product[]) => {
      dispatch(setRecommendedProducts(products));
    },
    [dispatch]
  );

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
      dispatch(filterProducts());
    },
    [dispatch]
  );

  const handleSetSelectedCategory = useCallback(
    (category: string) => {
      dispatch(setSelectedCategory(category));
      dispatch(filterProducts());
    },
    [dispatch]
  );

  const handleSetSelectedBrand = useCallback(
    (brand: string) => {
      dispatch(setSelectedBrand(brand));
      dispatch(filterProducts());
    },
    [dispatch]
  );

  const handleSetPriceRange = useCallback(
    (range: { min: number; max: number }) => {
      dispatch(setPriceRange(range));
      dispatch(filterProducts());
    },
    [dispatch]
  );

  const handleSetSortBy = useCallback(
    (sort: string) => {
      dispatch(setSortBy(sort));
      dispatch(filterProducts());
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

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

  return {
    products,
    filteredProducts,
    recommendedProducts,
    currentProduct,
    searchQuery,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    isLoading,
    error,
    setProducts: handleSetProducts,
    setCurrentProduct: handleSetCurrentProduct,
    setRecommendedProducts: handleSetRecommendedProducts,
    setSearchQuery: handleSetSearchQuery,
    setSelectedCategory: handleSetSelectedCategory,
    setSelectedBrand: handleSetSelectedBrand,
    setPriceRange: handleSetPriceRange,
    setSortBy: handleSetSortBy,
    clearFilters: handleClearFilters,
    setLoading: handleSetLoading,
    setError: handleSetError,
  };
};


