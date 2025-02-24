import { GuessItemModel } from './guess-item.model';

export interface GameModel {
  round: number;
  currentTeamId: string;
  guess: GuessItemModel | null;
  guessed: GuessItemModel[];
  skipped: GuessItemModel[];
  isStarted: boolean;
  isPaused: boolean;
  timer: number | null;
}
