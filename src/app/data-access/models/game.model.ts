import { ProgressModel } from './progress.model';

export interface GameModel {
  round: number;
  currentTeamId: string;
  toGuess: ProgressModel | null;
  guessed: ProgressModel[];
  skipped: ProgressModel[];
  isStarted: boolean;
  isPaused: boolean;
}
