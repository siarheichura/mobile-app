export interface GameModel {
  round: number;
  currentTeamId: string;
  guessed: number;
  skipped: number;
  isStarted: boolean;
  isPaused: boolean;
}
