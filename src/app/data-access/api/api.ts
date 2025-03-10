import { inject, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '@shared/services/storage.service';
import { UuidService } from '@shared/services/uuid.service';
import { from, map, Observable } from 'rxjs';
import { StorageKeys } from '../enums/storage-keys';
import { GameSettingsModel } from '../models/game-settings.model';
import { GameModel } from '../models/game.model';
import { TeamModel } from '../models/team.model';
import { TEAM_NAMES } from '../utils/constants/team-names.constants';
import { IApi } from './api.interface';

@Injectable({
  providedIn: 'root',
})
export class Api implements IApi {
  #uuidService = inject(UuidService);
  #storage = inject(StorageService);

  public getSettings(): Observable<GameSettingsModel | null> {
    return from(Preferences.get({ key: StorageKeys.GameSettings })).pipe(
      map((data) => (data.value ? JSON.parse(data.value) : null)),
    );
  }

  public setSettings(settings: GameSettingsModel): Observable<GameSettingsModel> {
    return from(
      Preferences.set({
        key: StorageKeys.GameSettings,
        value: JSON.stringify(settings),
      }),
    ).pipe(map(() => settings));
  }

  public clearSettings(): Observable<void> {
    return from(Preferences.remove({ key: StorageKeys.GameSettings }));
  }

  public getTeams(): Observable<TeamModel[]> {
    return from(Preferences.get({ key: StorageKeys.Teams })).pipe(
      map((data) => {
        if (data.value) {
          return JSON.parse(data.value);
        } else {
          const defaultTeams = this._generateDefaultTeams();
          void Preferences.set({ key: StorageKeys.Teams, value: JSON.stringify(defaultTeams) });

          return defaultTeams;
        }
      }),
    );
  }

  public setTeams(teams: TeamModel[]): Observable<TeamModel[]> {
    return from(Preferences.set({ key: StorageKeys.Teams, value: JSON.stringify(teams) })).pipe(
      map(() => teams),
    );
  }

  public clearTeams(): Observable<void> {
    return from(Preferences.remove({ key: StorageKeys.Teams }));
  }

  public getRandomTeamName(): string {
    const randomIndex = Math.floor(Math.random() * TEAM_NAMES.length);

    return TEAM_NAMES[randomIndex];
  }

  private _generateDefaultTeams(): TeamModel[] {
    return [
      { name: this.getRandomTeamName(), id: this.#uuidService.uuid(), score: 0 },
      { name: this.getRandomTeamName(), id: this.#uuidService.uuid(), score: 0 },
    ];
  }

  public getGameInfo(): Observable<GameModel | null> {
    return from(Preferences.get({ key: StorageKeys.Game })).pipe(
      map((data) => (data.value ? JSON.parse(data.value) : null)),
    );
  }

  public setGameInfo(game: GameModel): Observable<GameModel> {
    return from(
      Preferences.set({
        key: StorageKeys.Game,
        value: JSON.stringify(game),
      }),
    ).pipe(map(() => game));
  }

  public clearGameInfo(): Observable<void> {
    return from(Preferences.remove({ key: StorageKeys.Game }));
  }
}
