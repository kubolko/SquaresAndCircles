import { auth, GoogleAuthProvider, signInWithPopup } from '../firebase_options.js';
import { push } from 'svelte-spa-router';

// User interface for user data
interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

let user: User | null = null;

// Observer for auth state changes
auth.onAuthStateChanged((currentUser) => {
  console.log('Auth state changed:', currentUser);
  user = currentUser ? {
    uid: currentUser.uid,
    email: currentUser.email || undefined,
    displayName: currentUser.displayName || undefined,
    photoURL: currentUser.photoURL || undefined,
  } : null;
});

// Login function
const login = async () => {
  const provider = new GoogleAuthProvider();
  try {
    console.log('Attempting to log in...');
    const result = await signInWithPopup(auth, provider);
    console.log('Logged in successfully');
    user = {
      uid: result.user.uid,
      email: result.user.email  || undefined,
      displayName: result.user.displayName || undefined,
      photoURL: result.user.photoURL || undefined,
    };
    push('/workspace');
  } catch (error) {
    console.error('Error during login:', error);
  }
};

// Logout function
const logout = async () => {
  try {
    console.log('Attempting to log out...');
    await auth.signOut();
    console.log('Logged out successfully');
    user = null;
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export { user, login, logout };
