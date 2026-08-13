import { create } from 'zustand';
import type { Order } from '../types';
import { isFirebaseConfigured, db } from '../services/firebase/config';
import { doc, setDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';

interface OrderState {
  orders: Order[];
  lastPlacedOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  fetchOrders: (userId: string) => Promise<void>;
  placeOrder: (order: Order) => Promise<void>;
  clearLastPlacedOrder: () => void;
}

// Helpers for mock mode (localStorage)
const MOCK_ORDERS_KEY = 'omnimart_mock_orders';

const getMockOrders = (): Order[] => {
  const orders = localStorage.getItem(MOCK_ORDERS_KEY);
  if (!orders) {
    // Return empty initially or load seeds from mockData
    return [];
  }
  try {
    return JSON.parse(orders);
  } catch (e) {
    return [];
  }
};

const saveMockOrder = (order: Order) => {
  const orders = getMockOrders();
  orders.unshift(order); // Put new orders first
  localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(orders));
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  lastPlacedOrder: null,
  isLoading: false,
  error: null,

  clearLastPlacedOrder: () => set({ lastPlacedOrder: null }),

  fetchOrders: async (userId) => {
    set({ isLoading: true, error: null });
    if (isFirebaseConfigured) {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push(doc.data() as Order);
        });
        set({ orders: fetchedOrders, isLoading: false });
      } catch (error: any) {
        console.error('Fetch Orders Error:', error);
        set({ error: error.message || 'Failed to fetch orders.', isLoading: false });
      }
    } else {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 600));
      const allOrders = getMockOrders();
      const userOrders = allOrders.filter(o => o.userId === userId);
      set({ orders: userOrders, isLoading: false });
    }
  },

  placeOrder: async (order) => {
    set({ isLoading: true, error: null });
    if (isFirebaseConfigured) {
      try {
        // Save to Firestore using orderId as document path identifier
        await setDoc(doc(db, 'orders', order.orderId), order);
        
        // Add to active state orders
        set((state) => ({
          orders: [order, ...state.orders],
          lastPlacedOrder: order,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error('Place Order Error:', error);
        set({ error: error.message || 'Failed to place order.', isLoading: false });
        throw error;
      }
    } else {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 800));
      saveMockOrder(order);
      set((state) => ({
        orders: [order, ...state.orders],
        lastPlacedOrder: order,
        isLoading: false,
      }));
    }
  },
}));
