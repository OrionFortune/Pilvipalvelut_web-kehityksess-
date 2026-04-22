import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import type { User, UserCredential } from "firebase/auth"; 
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig"; 

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const result: UserCredential = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};