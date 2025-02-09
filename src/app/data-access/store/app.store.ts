import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { UuidService } from '@shared/services/uuid.service';
import { Api } from '../api/api';
import { TeamModel } from './models/team.model';
import { GameSettingsModel } from './models/game-settings.model';
import { RuleModel } from './models/rule.model';
import { rules } from '../utils/rules';
import { defaultSettings } from '../utils/default-settings';

export interface AppState {
  teams: TeamModel[];
  settings: GameSettingsModel | null;
  rules: RuleModel[];
  isLoading: boolean | null;
  error: unknown | null;
}

const initialState: AppState = {
  teams: [],
  settings: null,
  rules: [],
  isLoading: null,
  error: null,
};

export const AppStore = signalStore(
  withState<AppState>(initialState),

  withMethods((store, api = inject(Api), uuidService = inject(UuidService)) => ({
    getSettings: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.getSettings().pipe(
            tapResponse({
              next: (settings) =>
                patchState(store, { settings: settings || defaultSettings, error: null }),
              error: (error) => patchState(store, { settings: null, error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    setSettings: rxMethod<GameSettingsModel>(
      pipe(
        switchMap((settings) =>
          api.setSettings(settings).pipe(
            tapResponse({
              next: () => patchState(store, { settings, error: null }),
              error: (error) => patchState(store, { error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    clearSettings: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.clearSettings().pipe(
            tapResponse({
              next: () => patchState(store, { settings: null, error: null }),
              error: (error) => patchState(store, { error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    getTeams: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.getTeams().pipe(
            tapResponse({
              next: (teams) => patchState(store, { teams, error: null }),
              error: (error) => patchState(store, { teams: [], error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    addTeam: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: true,
            teams: [
              ...store.teams(),
              { name: api.getRandomTeamName(), id: uuidService.uuid(), score: 0 },
            ],
          }),
        ),
        switchMap(() =>
          api.setTeams(store.teams()).pipe(
            tapResponse({
              next: () => patchState(store, { error: null }),
              error: (error) => patchState(store, { error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    removeTeam: rxMethod<string>(
      pipe(
        tap((id) =>
          patchState(store, {
            isLoading: true,
            teams: [...store.teams().filter((team) => team.id !== id)],
          }),
        ),
        switchMap(() =>
          api.setTeams(store.teams()).pipe(
            tapResponse({
              next: () => patchState(store, { error: null }),
              error: (error) => patchState(store, { error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    clearTeams: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.clearTeams().pipe(
            tapResponse({
              next: () => patchState(store, { teams: [], error: null }),
              error: (error) => patchState(store, { error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    getRules() {
      patchState(store, { rules });
    },
  })),

  withHooks({
    onInit(store) {
      store.getSettings();
      store.getTeams();
      store.getRules();
    },
  }),
);
