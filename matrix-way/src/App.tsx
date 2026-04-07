import { useState, useEffect } from 'react'
import './App.css'

function App() {
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
    const cachedName = localStorage.getItem("codename");

    if (cachedName) {
      setCodename(cachedName);
    } else {
      const newName = generateCodename();
      localStorage.setItem("codename", newName);
      setCodename(newName);
    }
  }, []); 

  const handleReset = () => {
    localStorage.removeItem("codename");
    window.location.reload(); // 
  };

  return (
    <div className="App">
      <section id="center">
        <h1>Project Matrix</h1>
        
        <div className="card">
          <p>Your nickname:</p>
          <h2 style={{ color: '#68a4ff', fontSize: '2.5rem' }}>
            {codename || "Generating..."}
          </h2>
        </div>

        <button className="counter" onClick={handleReset}>
          Generate new nickname
        </button>
        
        <p style={{ marginTop: '25px', opacity: 0.7 }}>
          Your nickname is saved, you can refresh the page.
        </p>
      </section>
    </div>
  )
}

export default App