import { inject, Injectable } from '@angular/core';
import { StorageService } from '@shared/services/storage.service';
import { filter, map, Observable, switchMap } from 'rxjs';
import { StorageKeys } from '../../enums/storage-keys';
import { GameModel } from '../../models/game.model';
import { IGameApi } from './game-api.interface';

@Injectable({ providedIn: 'root' })
export class GameApiService implements IGameApi {
  #storage = inject(StorageService);

  get(): Observable<GameModel | null> {
    return this.#storage.get<GameModel>(StorageKeys.Game);
  }

  set(game: GameModel): Observable<GameModel> {
    return this.#storage.set<GameModel>(StorageKeys.Game, game);
  }

  update(data: Partial<GameModel>): Observable<GameModel> {
    return this.get().pipe(
      filter(Boolean),
      switchMap((game) => this.#storage.set(StorageKeys.Game, { ...game, ...data })),
    );
  }

  clear(): Observable<void> {
    return this.#storage.remove(StorageKeys.Game);
  }
}
