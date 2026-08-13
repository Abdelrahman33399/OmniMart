import { create } from 'zustand';
import type { User, Address } from '../types';
import { isFirebaseConfigured, auth, db } from '../services/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface AuthUser extends User {
  displayName?: string;
  photoURL?: string;
  phone?: string; // alias for phoneNumber
  address?: string; // summary of default address
}

interface AuthState {
  currentUser: AuthUser | null;
  isLoading: boolean;
  authError: string | null;
  
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  subscribeToAuthChanges: () => () => void;
  clearError: () => void;
  updateProfileInfo: (fullName: string, phoneNumber: string, email: string) => Promise<void>;
  updateUserAddresses: (addresses: Address[]) => Promise<void>;
  sendPasswordReset: () => Promise<void>;
}

// Helpers for mock mode (localStorage)
const MOCK_USERS_KEY = 'omnimart_mock_users';
const CURRENT_USER_KEY = 'omnimart_mock_current_user';

const getMockUsers = (): AuthUser[] => {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  if (!users) {
    // Seed with standard mockUser from specifications
    const seedUser: AuthUser = {
      uid: 'usr_982734',
      email: 'alex.developer@omnimart.com',
      fullName: 'Alex Rodriguez',
      displayName: 'Alex Rodriguez',
      role: 'customer',
      phoneNumber: '+1 (555) 019-2834',
      phone: '+1 (555) 019-2834',
      addresses: [
        {
          id: 'addr_1',
          title: 'Home Address',
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'IL',
          country: 'United States',
          zipCode: '62704',
          isDefault: true,
        },
        {
          id: 'addr_2',
          title: 'Office Address',
          street: '100 Infinite Loop',
          city: 'Cupertino',
          state: 'CA',
          country: 'United States',
          zipCode: '95014',
          isDefault: false,
        }
      ],
      wishlist: ['prod_101', 'prod_104'],
      createdAt: '2026-01-15T08:30:00Z',
      address: '742 Evergreen Terrace, Springfield, IL, 62704',
    };
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([seedUser]));
    return [seedUser];
  }
  return JSON.parse(users);
};

const saveMockUser = (user: AuthUser) => {
  const users = getMockUsers();
  const index = users.findIndex(u => u.uid === user.uid);
  if (index > -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const mapFirebaseUserToAuthUser = (firebaseUser: any, firestoreProfile: any): AuthUser => {
  const addresses = firestoreProfile?.addresses || [];
  const defaultAddress = addresses.find((a: any) => a.isDefault) || addresses[0];
  const addressString = defaultAddress
    ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.zipCode}`
    : '';

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    fullName: firestoreProfile?.fullName || firebaseUser.displayName || 'OmniMart User',
    displayName: firebaseUser.displayName || firestoreProfile?.fullName || 'OmniMart User',
    photoURL: firebaseUser.photoURL || undefined,
    phoneNumber: firestoreProfile?.phoneNumber || firebaseUser.phoneNumber || undefined,
    phone: firebaseUser.phoneNumber || firestoreProfile?.phoneNumber || undefined,
    addresses: addresses,
    wishlist: firestoreProfile?.wishlist || [],
    role: firestoreProfile?.role || 'customer',
    createdAt: firestoreProfile?.createdAt || new Date().toISOString(),
    address: addressString,
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isLoading: true, // start loading so auth change can sync initially
  authError: null,

  clearError: () => set({ authError: null }),

  loginWithEmail: async (email, password) => {
    set({ isLoading: true, authError: null });
    if (isFirebaseConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const profile = userDoc.exists() ? userDoc.data() : null;
        const mappedUser = mapFirebaseUserToAuthUser(userCredential.user, profile);
        set({ currentUser: mappedUser, isLoading: false });
      } catch (error: any) {
        console.error('Email Login Error:', error);
        set({ authError: error.message || 'Login failed.', isLoading: false });
        throw error;
      }
    } else {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
      const users = getMockUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      // For local development, allow any login or verify password. We allow simple testing
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        set({ currentUser: user, isLoading: false });
      } else {
        // Create new user if not found for easy testing in mock mode, or throw error.
        // Let's throw error for realism, but we can seed users.
        const errorMsg = 'Invalid email or password. Hint: Try using alex.developer@omnimart.com or register a new account.';
        set({ authError: errorMsg, isLoading: false });
        throw new Error(errorMsg);
      }
    }
  },

  registerWithEmail: async (email, password, fullName) => {
    set({ isLoading: true, authError: null });
    if (isFirebaseConfigured) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        
        const profileData = {
          uid: userCredential.user.uid,
          email: email,
          fullName: fullName,
          role: 'customer' as const,
          phoneNumber: '',
          addresses: [],
          wishlist: [],
          createdAt: new Date().toISOString()
        };

        // Save to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), profileData);
        
        const mappedUser = mapFirebaseUserToAuthUser(userCredential.user, profileData);
        set({ currentUser: mappedUser, isLoading: false });
      } catch (error: any) {
        console.error('Registration Error:', error);
        set({ authError: error.message || 'Registration failed.', isLoading: false });
        throw error;
      }
    } else {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 800));
      const users = getMockUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        const errorMsg = 'An account with this email already exists.';
        set({ authError: errorMsg, isLoading: false });
        throw new Error(errorMsg);
      }

      const mockNewUser: AuthUser = {
        uid: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email,
        fullName: fullName,
        displayName: fullName,
        role: 'customer',
        phoneNumber: '',
        phone: '',
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
        address: '',
      };

      saveMockUser(mockNewUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockNewUser));
      set({ currentUser: mockNewUser, isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, authError: null });
    if (isFirebaseConfigured) {
      try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        let profile = null;
        if (!userDoc.exists()) {
          // Create standard profile snapshot if registering with Google for first time
          profile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email || '',
            fullName: userCredential.user.displayName || 'Google User',
            role: 'customer' as const,
            phoneNumber: userCredential.user.phoneNumber || '',
            addresses: [],
            wishlist: [],
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, profile);
        } else {
          profile = userDoc.data();
        }

        const mappedUser = mapFirebaseUserToAuthUser(userCredential.user, profile);
        set({ currentUser: mappedUser, isLoading: false });
      } catch (error: any) {
        console.error('Google Sign In Error:', error);
        set({ authError: error.message || 'Google Authentication failed.', isLoading: false });
        throw error;
      }
    } else {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 800));
      const googleMockUser: AuthUser = {
        uid: 'usr_google_' + Math.random().toString(36).substring(2, 9),
        email: 'google.user@omnimart.com',
        fullName: 'Google Authenticated User',
        displayName: 'Google Authenticated User',
        role: 'customer',
        phoneNumber: '+1 (555) 999-8888',
        phone: '+1 (555) 999-8888',
        addresses: [
          {
            id: 'addr_google_1',
            title: 'Primary Delivery',
            street: '1600 Amphitheatre Pkwy',
            city: 'Mountain View',
            state: 'CA',
            country: 'United States',
            zipCode: '94043',
            isDefault: true,
          }
        ],
        wishlist: [],
        createdAt: new Date().toISOString(),
        address: '1600 Amphitheatre Pkwy, Mountain View, CA, 94043',
      };
      
      saveMockUser(googleMockUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(googleMockUser));
      set({ currentUser: googleMockUser, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
        set({ currentUser: null, isLoading: false });
      } catch (error: any) {
        console.error('Logout Error:', error);
        set({ authError: error.message || 'Logout failed.', isLoading: false });
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 400));
      localStorage.removeItem(CURRENT_USER_KEY);
      set({ currentUser: null, isLoading: false });
    }
  },

  subscribeToAuthChanges: () => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const profile = userDoc.exists() ? userDoc.data() : null;
            const mappedUser = mapFirebaseUserToAuthUser(firebaseUser, profile);
            set({ currentUser: mappedUser, isLoading: false });
          } catch (error) {
            console.error('Auth subscription user fetch error:', error);
            const mappedUser = mapFirebaseUserToAuthUser(firebaseUser, null);
            set({ currentUser: mappedUser, isLoading: false });
          }
        } else {
          set({ currentUser: null, isLoading: false });
        }
      });
      return unsubscribe;
    } else {
      // Mock mode initialization
      const mockCurrentUser = localStorage.getItem(CURRENT_USER_KEY);
      if (mockCurrentUser) {
        try {
          set({ currentUser: JSON.parse(mockCurrentUser), isLoading: false });
        } catch (e) {
          set({ currentUser: null, isLoading: false });
        }
      } else {
        set({ currentUser: null, isLoading: false });
      }
      // Return a clean mock unsubscribe
      return () => {};
    }
  },

  updateProfileInfo: async (fullName, phoneNumber, email) => {
    set({ isLoading: true, authError: null });
    const { currentUser } = get();
    if (!currentUser) {
      set({ authError: 'No authenticated user found.', isLoading: false });
      return;
    }

    if (isFirebaseConfigured) {
      try {
        // Try updating email in Auth if it changed
        if (auth.currentUser && auth.currentUser.email !== email) {
          try {
            await updateEmail(auth.currentUser, email);
          } catch (emailError: any) {
            console.warn('Firebase Auth email update skipped or requires reauthentication:', emailError);
            // We continue to save to Firestore so profile data remains updated
          }
        }
        
        await updateProfile(auth.currentUser!, { displayName: fullName });
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, { fullName, phoneNumber, email }, { merge: true });

        const updatedDoc = await getDoc(userDocRef);
        const profile = updatedDoc.exists() ? updatedDoc.data() : null;
        const mappedUser = mapFirebaseUserToAuthUser(auth.currentUser!, profile);
        set({ currentUser: mappedUser, isLoading: false });
      } catch (error: any) {
        console.error('Update Profile Info Error:', error);
        set({ authError: error.message || 'Failed to update profile info.', isLoading: false });
        throw error;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 600));
      const updatedUser: AuthUser = {
        ...currentUser,
        fullName,
        displayName: fullName,
        email,
        phoneNumber,
        phone: phoneNumber,
      };
      
      saveMockUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      set({ currentUser: updatedUser, isLoading: false });
    }
  },

  updateUserAddresses: async (addresses) => {
    set({ isLoading: true, authError: null });
    const { currentUser } = get();
    if (!currentUser) {
      set({ authError: 'No authenticated user found.', isLoading: false });
      return;
    }

    if (isFirebaseConfigured) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, { addresses }, { merge: true });

        const updatedDoc = await getDoc(userDocRef);
        const profile = updatedDoc.exists() ? updatedDoc.data() : null;
        const mappedUser = mapFirebaseUserToAuthUser(auth.currentUser!, profile);
        set({ currentUser: mappedUser, isLoading: false });
      } catch (error: any) {
        console.error('Update User Addresses Error:', error);
        set({ authError: error.message || 'Failed to update addresses.', isLoading: false });
        throw error;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 600));
      const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
      const addressString = defaultAddress
        ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.zipCode}`
        : '';

      const updatedUser: AuthUser = {
        ...currentUser,
        addresses,
        address: addressString,
      };

      saveMockUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      set({ currentUser: updatedUser, isLoading: false });
    }
  },

  sendPasswordReset: async () => {
    set({ isLoading: true, authError: null });
    const { currentUser } = get();
    if (!currentUser) {
      set({ authError: 'No authenticated user found.', isLoading: false });
      return;
    }

    if (isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, currentUser.email);
        set({ isLoading: false });
      } catch (error: any) {
        console.error('Password Reset Error:', error);
        set({ authError: error.message || 'Failed to send password reset email.', isLoading: false });
        throw error;
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 600));
      set({ isLoading: false });
    }
  },
}));
