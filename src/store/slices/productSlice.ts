import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/type/Product';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  recommendedProducts: Product[];
  currentProduct: Product | null;
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
  priceRange: { min: number; max: number };
  sortBy: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  recommendedProducts: [],
  currentProduct: null,
  searchQuery: '',
  selectedCategory: '',
  selectedBrand: '',
  priceRange: { min: 0, max: 10000 },
  sortBy: 'name',
  isLoading: false,
  error: null,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    setRecommendedProducts: (state, action: PayloadAction<Product[]>) => {
      state.recommendedProducts = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string>) => {
      state.selectedBrand = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.priceRange = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    filterProducts: (state) => {
      let filtered = [...state.products];

      // Search filter
      if (state.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }

      // Category filter
      if (state.selectedCategory) {
        filtered = filtered.filter(product => 
          product.category.name === state.selectedCategory
        );
      }

      // Brand filter
      if (state.selectedBrand) {
        filtered = filtered.filter(product => 
          product.brand === state.selectedBrand
        );
      }

      // Price range filter
      filtered = filtered.filter(product =>
        product.price >= state.priceRange.min && product.price <= state.priceRange.max
      );

      // Sort
      switch (state.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          filtered.sort((a, b) => (0) - (0));
          break;
        default:
          break;
      }

      state.filteredProducts = filtered;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.selectedBrand = '';
      state.priceRange = { min: 0, max: 10000 };
      state.sortBy = 'name';
      state.filteredProducts = state.products;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
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
} = productSlice.actions;

export default productSlice.reducer;



