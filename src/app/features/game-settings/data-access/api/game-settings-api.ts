import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { IGameSettingsApi } from './game-settings-api.interface';
import { GameSettingsModel } from '../store/models/game-settings.model';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsApi implements IGameSettingsApi {
  private readonly _storageKey = 'GAME_SETTINGS';

  public get(): Observable<GameSettingsModel | null> {
    return from(Preferences.get({ key: this._storageKey })).pipe(
      map((data) => (data.value ? JSON.parse(data.value) : null)),
    );
  }

  public set(settings: GameSettingsModel): Observable<void> {
    return from(Preferences.set({ key: this._storageKey, value: JSON.stringify(settings) }));
  }

  public clear(): Observable<void> {
    return from(Preferences.remove({ key: this._storageKey }));
  }
}
