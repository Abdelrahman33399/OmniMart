import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';
import { useNavigationStore } from './useNavigationStore';

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discountPercentage: number;
  freeShippingThreshold: number;

  addItem: (product: Product, quantity: number, selectedAttributes?: Record<string, string>) => void;
  removeItem: (productId: string, selectedAttributes?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedAttributes?: Record<string, string>) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  clearCart: () => void;
}

// Helper to check if two attribute records match
const matchAttributes = (a?: Record<string, string>, b?: Record<string, string>) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountPercentage: 0,
      freeShippingThreshold: 50.0,

      addItem: (product, quantity, selectedAttributes) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              matchAttributes(item.selectedAttributes, selectedAttributes)
          );

          let newItems = [...state.items];

          if (existingItemIndex > -1) {
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity,
            };
          } else {
            // Find effective unit price considering discounts
            const unitPrice =
              product.discountPrice !== null && product.discountPrice !== undefined
                ? product.discountPrice
                : product.price;

            newItems.push({
              productId: product.id,
              quantity,
              selectedAttributes,
              unitPrice,
            });
          }

          return { items: newItems };
        });

        // Automatically open slide-over Cart Drawer
        useNavigationStore.getState().toggleCartDrawer(true);
      },

      removeItem: (productId, selectedAttributes) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                matchAttributes(item.selectedAttributes, selectedAttributes)
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedAttributes) => {
        if (quantity < 1) {
          get().removeItem(productId, selectedAttributes);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            matchAttributes(item.selectedAttributes, selectedAttributes)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      applyPromoCode: (code) => {
        const cleanedCode = code.trim().toUpperCase();
        if (cleanedCode === 'OMNI2026') {
          set({ promoCode: 'OMNI2026', discountPercentage: 10 });
          return { success: true, message: 'Coupon OMNI2026 applied successfully (10% off)!' };
        }
        return { success: false, message: 'Invalid promo code. Try OMNI2026.' };
      },

      removePromoCode: () => {
        set({ promoCode: null, discountPercentage: 0 });
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discountPercentage: 0 });
      },
    }),
    {
      name: 'omnimart-cart-storage',
    }
  )
);

// Derived state selectors (memoized implicitly by React when used)
export const selectSubtotal = (state: { items: CartItem[] }) =>
  state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

export const selectTotalItems = (state: { items: CartItem[] }) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectDiscountAmount = (state: { items: CartItem[]; discountPercentage: number }) => {
  const subtotal = selectSubtotal(state);
  return (subtotal * state.discountPercentage) / 100;
};

export const selectShippingFee = (state: { items: CartItem[]; freeShippingThreshold: number }) => {
  const subtotal = selectSubtotal(state);
  if (subtotal === 0) return 0;
  return subtotal >= state.freeShippingThreshold ? 0 : 10.0;
};

export const selectGrandTotal = (state: {
  items: CartItem[];
  discountPercentage: number;
  freeShippingThreshold: number;
}) => {
  const subtotal = selectSubtotal(state);
  const discount = selectDiscountAmount(state);
  const shipping = selectShippingFee(state);
  return subtotal - discount + shipping;
};

export const selectFreeShippingRemaining = (state: {
  items: CartItem[];
  freeShippingThreshold: number;
}) => {
  const subtotal = selectSubtotal(state);
  return Math.max(0, state.freeShippingThreshold - subtotal);
};
