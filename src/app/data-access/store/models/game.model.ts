import { TeamModel } from './team.model';

export interface GameModel {
  round: number;
  currentTeam: TeamModel;
}
