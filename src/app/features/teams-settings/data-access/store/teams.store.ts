import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UuidService } from '@shared/services/uuid.service';
import { pipe, switchMap, tap } from 'rxjs';
import { TeamsApi } from '../api/teams-api';
import { Team } from './models/team.model';

interface AppState {
  teams: Team[];
  isLoading: boolean | null;
  error: unknown | null;
}

const initialState: AppState = {
  teams: [],
  isLoading: null,
  error: null,
};

export const TeamsStore = signalStore(
  withState<AppState>(initialState),

  withMethods((store, api = inject(TeamsApi), uuidService = inject(UuidService)) => ({
    getTeams: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.get().pipe(
            tapResponse({
              next: (teams) => patchState(store, { teams, error: null }),
              error: (error) => patchState(store, { teams: [], error: error }),
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
            teams: [...store.teams(), { name: api.getRandomTeamName(), id: uuidService.uuid() }],
          }),
        ),
        switchMap(() =>
          api.set(store.teams()).pipe(
            tapResponse({
              next: () => patchState(store, { error: null }),
              error: (error) => patchState(store, { error: error }),
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
          api.set(store.teams()).pipe(
            tapResponse({
              next: () => patchState(store, { error: null }),
              error: (error) => patchState(store, { error: error }),
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
          api.clear().pipe(
            tapResponse({
              next: () => patchState(store, { teams: [], error: null }),
              error: (error) => patchState(store, { error: error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),

  withHooks({
    onInit(store) {
      store.getTeams();
    },
  }),
);
