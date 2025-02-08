import { Observable } from 'rxjs';
import { GameSettingsModel } from '../store/models/game-settings.model';

export interface IGameSettingsApi {
  get(): Observable<GameSettingsModel | null>;
  set(settings: GameSettingsModel): Observable<void>;
  clear(): Observable<void>;
}
