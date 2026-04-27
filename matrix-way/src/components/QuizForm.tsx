import React, { useState } from 'react';
import type { Player } from '../types/game';
import { RoundResult } from './RoundResult';

interface QuizFormProps {
  players: Player[];
  currentUserId: string;
  onSubmitGuess: (guess: number) => void;
  correctPrice?: number;
}

export const QuizForm: React.FC<QuizFormProps> = ({ 
  players, 
  currentUserId, 
  onSubmitGuess, 
  correctPrice 
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  // Если цена уже известна (раунд завершен), показываем компонент результатов
  if (correctPrice !== undefined) {
    return <RoundResult players={players} correctPrice={correctPrice} />;
  }

  const currentPlayer = players.find(p => p.id === currentUserId);
  const hasGuessed = currentPlayer?.guess !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onSubmitGuess(numValue);
    }
  };

  return (
    <div className="quiz-form">
      {/* Pelaajalista */}
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <h4>Pelaajat:</h4>
        {players.map(player => (
          <div 
            key={player.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              opacity: player.guess !== null ? 1 : 0.5 
            }}
          >
            <span>
              {player.codename} {player.id === currentUserId && "(Sinä)"}
            </span>
            <span>
              {player.guess !== null ? '✅ Valmis' : '...miettii'}
            </span>
          </div>
        ))}
      </div>

      <hr style={{ opacity: 0.2, margin: '20px 0' }} />

      {!hasGuessed ? (
        <form onSubmit={handleSubmit}>
          <p>Mikä on tuotteen hinta?</p>
          <input
            type="number"
            step="0.01"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0.00"
            required
            style={{ 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #68a4ff', 
              width: '100px', 
              marginRight: '10px',
              background: '#222',
              color: 'white'
            }}
          />
          <button type="submit" className="counter">Lähetä arvaus</button>
        </form>
      ) : (
        <div style={{ background: '#333', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <p>Olet antanut arvauksesi: <strong>{currentPlayer?.guess} €</strong></p>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            Odotetaan muiden pelaajien vastauksia...
          </p>
        </div>
      )}
    </div>
  );
};