import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  async function register(email, password, role, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
    
    const newUserData = {
      uid: user.uid,
      email: email,
      role: role,
      name: name || email.split('@')[0],
      avatarUrl: defaultAvatar,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, "Users", user.uid), newUserData);
    setUserData(newUserData);
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle(role = 'worker') {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const newUserData = {
        uid: user.uid,
        email: user.email,
        role: role,
        name: user.displayName || user.email.split('@')[0],
        avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, newUserData);
      setUserData(newUserData);
    } else {
      setUserData(docSnap.data());
    }
    
    return result;
  }

  function logout() {
    setUserData(null);
    setUnreadCount(0);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribeAuth;
  }, []);

  // Global listener for unread messages
  useEffect(() => {
    if (!currentUser) {
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, "Messages"), 
      where("receiverId", "==", currentUser.uid)
    );

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const unread = snapshot.docs.filter(doc => doc.data().isRead === false);
      setUnreadCount(unread.length);
    });

    return unsubscribeMessages;
  }, [currentUser]);

  const value = {
    currentUser,
    userData,
    userRole: userData?.role,
    unreadCount,
    login,
    loginWithGoogle,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
