import { type Player } from "../types/game";

export function RoundResult({ players, correctPrice }: { players: Player[]; correctPrice: number }) {
  return (
    <div className="round-result">
      <h3>Kierroksen tulos</h3>
      <p>Oikea hinta: <strong>{correctPrice} €</strong></p>
      <ul>
        {players.map(p => (
          <li key={p.id}>
            {p.codename}: {p.guess} € 
            <span style={{ color: '#4caf50', marginLeft: '10px' }}>
              (ero {Math.abs((p.guess || 0) - correctPrice).toFixed(2)} €)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}