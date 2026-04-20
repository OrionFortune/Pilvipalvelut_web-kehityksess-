import { useState, useEffect } from 'react'
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, logout } from "./authService";
import LoginForm from "./LoginForm";
import './App.css'

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [codename, setCodename] = useState<string>("");

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
      }
    });

    return () => unsubscribe();
  }, []);

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
      <section id="center">
        <h1>Project Matrix</h1>

        {user ? (
          <>
            <div className="card">
              <p>👋 Hello, {user.email}</p>
              <p>Your nickname:</p>
              <h2 style={{ color: '#68a4ff', fontSize: '2.5rem' }}>
                {codename || "Generating..."}
              </h2>
            </div>

            <button className="counter" onClick={handleReset}>
              Generate new nickname
            </button>

            <button 
              onClick={logout} 
              style={{ marginTop: '20px', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '5px 10px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <LoginForm />
        )}

        <p style={{ marginTop: '25px', opacity: 0.7 }}>
          {user ? "Your nickname is tied to your account." : "Please log in to see your nickname."}
        </p>
      </section>
    </div>
  )
}

export default App