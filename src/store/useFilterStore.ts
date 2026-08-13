import { create } from 'zustand';

export type SortOption = 'featured' | 'price-low-high' | 'price-high-low' | 'rating' | 'newest';
export type ViewMode = 'grid' | 'list';

interface FilterState {
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  sortBy: SortOption;
  viewMode: ViewMode;
  searchQuery: string;

  setCategories: (categories: string[]) => void;
  setBrands: (brands: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setMinRating: (rating: number) => void;
  toggleInStock: (val?: boolean) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  removeFilterChip: (key: 'category' | 'brand' | 'rating' | 'price' | 'stock' | 'search', value?: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedCategories: [],
  selectedBrands: [],
  priceRange: [0, 3000],
  minRating: 0,
  inStockOnly: false,
  sortBy: 'featured',
  viewMode: 'grid',
  searchQuery: '',

  setCategories: (categories) => set({ selectedCategories: categories }),
  
  setBrands: (brands) => set({ selectedBrands: brands }),
  
  setPriceRange: (range) => set({ priceRange: range }),
  
  setMinRating: (rating) => set({ minRating: rating }),
  
  toggleInStock: (val) =>
    set((state) => ({
      inStockOnly: val !== undefined ? val : !state.inStockOnly,
    })),
    
  setSortBy: (sort) => set({ sortBy: sort }),
  
  setViewMode: (mode) => set({ viewMode: mode }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () =>
    set({
      selectedCategories: [],
      selectedBrands: [],
      priceRange: [0, 3000],
      minRating: 0,
      inStockOnly: false,
      searchQuery: '',
    }),

  removeFilterChip: (key, value) =>
    set((state) => {
      switch (key) {
        case 'category':
          return {
            selectedCategories: state.selectedCategories.filter((c) => c !== value),
          };
        case 'brand':
          return {
            selectedBrands: state.selectedBrands.filter((b) => b !== value),
          };
        case 'rating':
          return { minRating: 0 };
        case 'price':
          return { priceRange: [0, 3000] };
        case 'stock':
          return { inStockOnly: false };
        case 'search':
          return { searchQuery: '' };
        default:
          return {};
      }
    }),
}));
