import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, phone?: string, age?: number, gender?: 'Male' | 'Female' | 'Other') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or sync user profile from Firestore
  const fetchUserProfile = async (uid: string, fallbackEmail?: string, fallbackDisplayName?: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        // Create initial profile doc if missing
        const newProfile: UserProfile = {
          uid,
          displayName: fallbackDisplayName || 'Patient',
          email: fallbackEmail || '',
          createdAt: new Date().toISOString(),
        };
        try {
          await setDoc(userDocRef, newProfile);
        } catch (setErr) {
          console.warn('Firestore user profile write permission restricted:', setErr);
        }
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.warn('Firestore user profile read permission restricted, using Auth fallback:', error);
      // Local fallback profile
      setUserProfile({
        uid,
        displayName: fallbackDisplayName || 'Patient',
        email: fallbackEmail || '',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid, user.email || '', user.displayName || '');
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    displayName: string, 
    phone?: string, 
    age?: number, 
    gender?: 'Male' | 'Female' | 'Other'
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth display name
    await updateProfile(user, { displayName });

    // Save extended profile in Firestore
    const profileData: UserProfile = {
      uid: user.uid,
      displayName,
      email,
      phone: phone || '',
      age: age || 25,
      gender: gender || 'Male',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profileData);
    } catch (firestoreErr) {
      console.warn('Firestore user doc write skipped due to permission rules:', firestoreErr);
    }

    setUserProfile(profileData);
  };

  const ADMIN_EMAIL = 'shubhankar_rao@gmail.com';

  const isAdmin = Boolean(
    currentUser && currentUser.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // Special handling for admin credentials if account hasn't been initialized in Firebase Auth
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        try {
          await signUp(email.trim(), password, 'Hospital Administrator', '+1 (555) 999-0000', 40, 'Male');
          return;
        } catch (signupErr) {
          console.error('Admin signup fallback error:', signupErr);
        }
      }
      throw err;
    }
  };

  const googleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await fetchUserProfile(user.uid, user.email || '', user.displayName || 'Google Patient');
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, data);
    } catch (err) {
      console.warn('Firestore updateProfileData skipped due to permission rules:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        signUp,
        signIn,
        googleSignIn,
        logout,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
