import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { UuidService } from '@shared/services/uuid.service';
import { ITeamsApi } from './teams-api.interface';
import { TeamModel } from '../store/models/team.model';
import { teamNames } from '../store/utils/team-names';

@Injectable({
  providedIn: 'root',
})
export class TeamsApi implements ITeamsApi {
  private _uuidService = inject(UuidService);

  private readonly _storageKey = 'TEAMS';

  public get(): Observable<TeamModel[]> {
    return from(Preferences.get({ key: this._storageKey })).pipe(
      map((data) => {
        if (data.value) {
          return JSON.parse(data.value);
        } else {
          const defaultTeams = this._generateDefaultTeams();
          void Preferences.set({ key: this._storageKey, value: JSON.stringify(defaultTeams) });

          return defaultTeams;
        }
      }),
    );
  }

  public set(teams: TeamModel[]): Observable<void> {
    return from(Preferences.set({ key: this._storageKey, value: JSON.stringify(teams) }));
  }

  public clear(): Observable<void> {
    return from(Preferences.remove({ key: this._storageKey }));
  }

  public getRandomTeamName(): string {
    const randomIndex = Math.floor(Math.random() * teamNames.length);

    return teamNames[randomIndex];
  }

  private _generateDefaultTeams(): TeamModel[] {
    return [
      { name: this.getRandomTeamName(), id: this._uuidService.uuid() },
      { name: this.getRandomTeamName(), id: this._uuidService.uuid() },
    ];
  }
}
