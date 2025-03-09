import { Observable } from 'rxjs';
import { GameModel } from '../../models/game.model';

export interface IGameApi {
  get(): Observable<GameModel | null>;
  set(game: GameModel): Observable<GameModel>;
  clear(): Observable<void>;
}
