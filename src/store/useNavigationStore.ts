import { create } from 'zustand';

export type ProfileTab = 'overview' | 'orders' | 'tracking' | 'addresses' | 'settings' | 'wishlist';
export type NavTab = 'shop' | 'cart' | 'checkout' | 'order-success' | 'orders' | 'profile';

interface NavigationState {
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  isAuthModalOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  activeTab: NavTab;
  activeProfileTab: ProfileTab;
  selectedOrderId: string | null;

  toggleCartDrawer: (open?: boolean) => void;
  toggleMobileMenu: (open?: boolean) => void;
  toggleAuthModal: (open?: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
  setActiveTab: (tab: NavTab) => void;
  setProfileSubTab: (tab: ProfileTab, selectedOrderId?: string | null) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isAuthModalOpen: false,
  searchQuery: '',
  selectedCategory: 'all',
  activeTab: 'shop',
  activeProfileTab: 'overview',
  selectedOrderId: null,

  toggleCartDrawer: (open) =>
    set((state) => ({
      isCartDrawerOpen: open !== undefined ? open : !state.isCartDrawerOpen,
    })),

  toggleMobileMenu: (open) =>
    set((state) => ({
      isMobileMenuOpen: open !== undefined ? open : !state.isMobileMenuOpen,
    })),

  toggleAuthModal: (open) =>
    set((state) => ({
      isAuthModalOpen: open !== undefined ? open : !state.isAuthModalOpen,
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetFilters: () => set({ searchQuery: '', selectedCategory: 'all' }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setProfileSubTab: (tab, selectedOrderId = null) =>
    set({
      activeTab: 'profile',
      activeProfileTab: tab,
      selectedOrderId,
    }),
}));