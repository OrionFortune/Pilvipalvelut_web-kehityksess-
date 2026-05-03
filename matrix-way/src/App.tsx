import { useState, useEffect } from 'react'
import { onAuthStateChanged, type User } from "firebase/auth";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { auth, logout } from "./authService";
import LoginForm from "./LoginForm";
import './App.css'

// Analytics integration
import ConsentBanner from './components/ConsentBanner';
import { useCloudflareAnalytics } from './hooks/useCloudflareAnalytics';

import type { Session } from './types/game';
import { createSession, submitGuess, joinSession } from './services/gameSessionService';
import { QuizForm } from './components/QuizForm'; 

// Component for tracking page views
function RouteAnalytics() {
  const { trackEvent } = useCloudflareAnalytics();
  
  useEffect(() => {
    trackEvent("page_view", {
      landingPath: window.location.pathname,
    });
  }, [trackEvent]);

  return null;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [codename, setCodename] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [joinId, setJoinId] = useState("");

  const generateCodename = () => {
    const adjectives = ["SneakyBoyscout", "BraveNeo", "Cyberbro", "Mysticbox", "Goldenapple", "SilentHill"];
    const nouns = ["PandaOnRanta", "KingTiger2", "Fatcon", "HostCost69", "Holdthedor", "ShadowCryDise"];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 100);
    return `${randomAdj}${randomNoun}${randomNumber}`;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const storageKey = `codename_${firebaseUser.uid}`;
        const cachedName = localStorage.getItem(storageKey);
        if (cachedName) {
          setCodename(cachedName);
        } else {
          const newName = generateCodename();
          localStorage.setItem(storageKey, newName);
          setCodename(newName);
        }
      } else {
        setCodename("");
        setSession(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.id) return;

    const db = getFirestore();
    const unsubscribe = onSnapshot(doc(db, "sessions", session.id), (snapshot) => {
      if (snapshot.exists()) {
        setSession({ id: snapshot.id, ...snapshot.data() } as Session);
      }
    });

    return () => unsubscribe();
  }, [session?.id]);

  const handleStartGame = async () => {
    if (user) {
      try {
        const sessionId = await createSession("New Game", codename, user.uid);
        setSession({ id: sessionId } as any); 
      } catch (err) {
        console.error("Game session error:", err);
        alert("Error starting game");
      }
    }
  };

  const handleJoinGame = async () => {
    if (!joinId.trim() || !user) return;
    try {
      await joinSession(joinId.trim(), codename, user.uid);
      setSession({ id: joinId.trim() } as any);
    } catch (err) {
      console.error("Join Error:", err);
      alert("Room not found!"); 
    }
  };

  const handleReset = () => {
    if (user) {
      const storageKey = `codename_${user.uid}`;
      localStorage.removeItem(storageKey);
      const newName = generateCodename();
      localStorage.setItem(storageKey, newName);
      setCodename(newName);
    }
  };

  return (
    <div className="App">
      <RouteAnalytics />

      <section id="center">
        <h1>Project Matrix</h1>

        {user ? (
          <>
            <div className="card">
              <p>👋 Hei, {user.email}</p>
              <p>Nimimerkkisi: <strong style={{ color: '#68a4ff' }}>{codename}</strong></p>
            </div>

            {!session ? (
              <div className="setup-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                <button className="counter" onClick={handleStartGame}>
                  🚀 Aloita uusi peli
                </button>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Room ID..." 
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    style={{ 
                      padding: '10px', 
                      borderRadius: '5px', 
                      border: '1px solid #444', 
                      background: '#222', 
                      color: 'white' 
                    }}
                  />
                  <button onClick={handleJoinGame}>
                    Liity
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #68a4ff', borderRadius: '10px', background: '#1a1a1a' }}>
                <h3>🎮 Pelihuone aktiivinen</h3>
                <p>Status: <span style={{ color: '#4caf50' }}>{session.status}</span></p>
                <p>Arvaa hinta tuotteelle:</p>
                <h2 style={{ color: '#ffcc00' }}>{session.productName || "Searching product..."}</h2>
                
                <QuizForm 
                  players={session.players || []}
                  currentUserId={user.uid}
                  onSubmitGuess={(guessValue) => 
                    submitGuess(session.id, session.players || [], user.uid, guessValue)
                  }
                  correctPrice={
                    session.players?.find(p => p.id === user.uid)?.guess !== null 
                    ? (session.correctPrice ?? undefined) 
                    : undefined
                  }
                />

                <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '15px' }}>Room ID: {session.id}</p>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <button onClick={handleReset} style={{ fontSize: '0.8rem', marginRight: '10px' }}>
                Vaihda nimimerkki
              </button>
              <button 
                onClick={logout} 
                style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '5px 10px', cursor: 'pointer' }}
              >
                Kirjaudu ulos
              </button>
              <a href="../viikko6.html" style={{ color: '#68a4ff', display: 'block', marginTop: '10px' }}>
              Viikko 6: Analytiikka ja CORS
              </a>
            </div>
          </>
        ) : (
          <LoginForm />
        )}
      </section>

      <ConsentBanner />
    </div>
  );
}

export default App;
