import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { UuidService } from '@shared/services/uuid.service';
import { IApi } from './api.interface';
import { StorageKeys } from '../enums/storage-keys';
import { teamNames } from '../utils/team-names';
import { TeamModel } from '../store/models/team.model';
import { GameSettingsModel } from '../store/models/game-settings.model';
import { GameModel } from '../store/models/game.model';

@Injectable({
  providedIn: 'root',
})
export class Api implements IApi {
  private _uuidService = inject(UuidService);

  public getSettings(): Observable<GameSettingsModel | null> {
    return from(Preferences.get({ key: StorageKeys.GameSettings })).pipe(
      map((data) => (data.value ? JSON.parse(data.value) : null)),
    );
  }

  public setSettings(settings: GameSettingsModel): Observable<void> {
    return from(
      Preferences.set({ key: StorageKeys.GameSettings, value: JSON.stringify(settings) }),
    );
  }

  public clearSettings(): Observable<void> {
    return from(Preferences.remove({ key: StorageKeys.GameSettings }));
  }

  // directly in store
  // public getRules(): Observable<RuleModel[]> {}

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

  public setTeams(teams: TeamModel[]): Observable<void> {
    return from(Preferences.set({ key: StorageKeys.Teams, value: JSON.stringify(teams) }));
  }

  public clearTeams(): Observable<void> {
    return from(Preferences.remove({ key: StorageKeys.Teams }));
  }

  public getRandomTeamName(): string {
    const randomIndex = Math.floor(Math.random() * teamNames.length);

    return teamNames[randomIndex];
  }

  private _generateDefaultTeams(): TeamModel[] {
    return [
      { name: this.getRandomTeamName(), id: this._uuidService.uuid(), score: 0 },
      { name: this.getRandomTeamName(), id: this._uuidService.uuid(), score: 0 },
    ];
  }

  public getGameInfo(): Observable<GameModel | null> {
    return from(Preferences.get({ key: StorageKeys.Game })).pipe(
      map((data) => (data.value ? JSON.parse(data.value) : null)),
    );
  }

  public setGameInfo(game: GameModel): Observable<void> {
    return from(Preferences.set({ key: StorageKeys.Game, value: JSON.stringify(game) }));
  }

  public clearGameInfo(): Observable<void> {
    return from(Preferences.remove({ key: StorageKeys.Game }));
  }
}
