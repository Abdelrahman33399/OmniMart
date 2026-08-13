export interface Address {
  id: string;
  title: string; // e.g., "Home", "Office"
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  recipientName?: string;
  recipientPhone?: string;
  building?: string;
}

export interface User {
  uid: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  phoneNumber?: string;
  addresses: Address[];
  wishlist: string[]; // array of productIds
  createdAt: Date | string;
}

export interface CategoryName {
  ar: string;
  en: string;
}

export interface Category {
  id: string;
  name: CategoryName;
  slug: string;
  icon?: string; // Icon name from Lucide
  image?: string; // Image URL
  parentCategoryId?: string | null;
  featured: boolean;
  displayOrder: number;
}

export interface ProductTitle {
  ar: string;
  en: string;
}

export interface Product {
  id: string;
  title: ProductTitle;
  slug: string;
  sku: string;
  categoryId: string;
  subCategoryId?: string | null;
  brand: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  isAvailable: boolean;
  images: string[];
  attributes: Record<string, string | number | boolean | string[]>;
  rating: {
    average: number;
    count: number;
  };
  isFeatured: boolean;
  createdAt: Date | string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedAttributes?: Record<string, string>;
  unitPrice: number;
}

export interface OrderItem {
  productId: string;
  title: ProductTitle;
  quantity: number;
  selectedAttributes: Record<string, string | number>;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface OrderPricing {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'card' | 'paypal' | 'wallet';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  orderId: string;
  userId: string | null; // Nullable for guest users
  customerInfo: CustomerInfo;
  items: OrderItem[];
  shippingAddress: Address;
  pricing: OrderPricing;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  createdAt: Date | string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // e.g., 1-5 stars
  comment: string;
  createdAt: Date | string;
}

