import { Observable } from 'rxjs';
import { TeamModel } from '../store/models/team.model';
import { GameSettingsModel } from '../store/models/game-settings.model';
import { GameModel } from '../store/models/game.model';

export interface IApi {
  getSettings(): Observable<GameSettingsModel | null>;
  setSettings(settings: GameSettingsModel): Observable<void>;
  clearSettings(): Observable<void>;

  getTeams(): Observable<TeamModel[] | null>;
  setTeams(teams: TeamModel[]): Observable<void>;
  clearTeams(): Observable<void>;

  getGameInfo(): Observable<GameModel | null>;
  setGameInfo(game: GameModel): Observable<void>;
  clearGameInfo(): Observable<void>;
}
