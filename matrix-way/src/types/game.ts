export type SessionStatus = "waiting" | "playing" | "finished";

export interface Player {
  id: string;      // Firebase UID
  codename: string;
  guess: number | null;
  score: number;
}

export interface Session {
  id: string;
  name: string;
  status: SessionStatus;
  players: Player[];
  productName: string;
  correctPrice: number | null;
}