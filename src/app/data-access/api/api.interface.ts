import { Observable } from 'rxjs';
import { TeamModel } from '../models/team.model';
import { GameSettingsModel } from '../models/game-settings.model';
import { GameModel } from '../models/game.model';

export interface IApi {
  getSettings(): Observable<GameSettingsModel | null>;
  setSettings(settings: GameSettingsModel): Observable<GameSettingsModel>;
  clearSettings(): Observable<void>;

  getTeams(): Observable<TeamModel[] | null>;
  setTeams(teams: TeamModel[]): Observable<TeamModel[]>;
  clearTeams(): Observable<void>;

  getGameInfo(): Observable<GameModel | null>;
  setGameInfo(game: GameModel): Observable<GameModel>;
  clearGameInfo(): Observable<void>;
}
