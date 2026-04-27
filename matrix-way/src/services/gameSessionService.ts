import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  arrayUnion 
} from "firebase/firestore";
import { fetchRandomProduct } from "./productService";
import type { SessionStatus, Player } from "../types/game";

const db = getFirestore();


export const createSession = async (sessionName: string, creatorName: string, creatorId: string) => {
  console.log("1. [Service] Starting createSession...");
  
  try {
    console.log("2. [Service] Fetching random product from API...");
    const product = await fetchRandomProduct();
    console.log("3. [Service] Product received:", product.title, "Price:", product.price);
    
    const creator: Player = {
      id: creatorId,
      codename: creatorName,
      guess: null,
      score: 0
    };

    const sessionData = {
      name: sessionName,
      status: "waiting" as SessionStatus,
      players: [creator],
      productName: product.title,
      correctPrice: product.price,
      currentRound: 1,
      createdBy: creatorId,
      createdAt: serverTimestamp()
    };

    console.log("4. [Service] Attempting to write to Firestore...");
    const docRef = await addDoc(collection(db, "sessions"), sessionData);
    
    console.log("5. [Service] Success! Session ID:", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("❌ [Service] Error inside createSession:", error);
    throw error; 
  }
};

export const joinSession = async (sessionId: string, playerName: string, playerId: string) => {
  console.log(`[Service] Attempting to join session: ${sessionId}`);
  
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      throw new Error("Huonetta ei löytynyt! Tarkista ID."); 
    }

    const newPlayer: Player = {
      id: playerId,
      codename: playerName,
      guess: null,
      score: 0
    };

    const currentPlayers = sessionSnap.data().players as Player[];
    if (currentPlayers.find(p => p.id === playerId)) {
      console.log("[Service] Player already in room.");
      return sessionId;
    }

    await updateDoc(sessionRef, {
      players: arrayUnion(newPlayer)
    });

    console.log("✅ [Service] Player added successfully");
    return sessionId;
  } catch (error) {
    console.error("❌ [Service] Join error:", error);
    throw error;
  }
};

export const submitGuess = async (sessionId: string, players: Player[], playerId: string, guessValue: number) => {
  console.log(`[Service] Submitting guess ${guessValue} for player ${playerId}`);
  
  try {
    const sessionRef = doc(db, "sessions", sessionId);

    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, guess: guessValue } : p
    );

    await updateDoc(sessionRef, {
      players: updatedPlayers
    });

    console.log("✅ [Service] Guess saved to Firestore");
  } catch (error) {
    console.error("❌ [Service] Submission error:", error);
    throw error;
  }
};