import { Observable } from 'rxjs';
import { TeamModel } from '../store/models/team.model';
import { GameSettingsModel } from '../store/models/game-settings.model';
import { GameModel } from '../store/models/game.model';

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
