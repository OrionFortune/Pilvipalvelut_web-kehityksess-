import { useState } from "react";
import { loginWithEmail } from "./authService";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError("Virhe kirjautumisessa: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <h2>Kirjaudu sisään</h2>
      <input 
        type="email" 
        placeholder="Sähköposti" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Salasana" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Kirjaudutaan..." : "Kirjaudu"}
      </button>
    </form>
  );
};

export default LoginForm;