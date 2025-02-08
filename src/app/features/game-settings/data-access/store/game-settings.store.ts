import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { GameSettingsApi } from '../api/game-settings-api';
import { GameSettingsModel } from './models/game-settings.model';

interface GameSettingsState {
  settings: GameSettingsModel | null;
  isLoading: boolean | null;
  error: unknown | null;
}

const initialState: GameSettingsState = {
  settings: null,
  isLoading: null,
  error: null,
};

export const GameSettingsStore = signalStore(
  withState<GameSettingsState>(initialState),

  withMethods((store, api = inject(GameSettingsApi)) => ({
    get: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.get().pipe(
            tapResponse({
              next: (settings) => patchState(store, { settings, error: null }),
              error: (error) => patchState(store, { settings: null, error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    set: rxMethod<GameSettingsModel>(
      pipe(
        tap((settings) => patchState(store, { isLoading: true, settings })),
        switchMap((settings) =>
          api.set(settings).pipe(
            tapResponse({
              next: () => patchState(store, { error: null }),
              error: (error) => patchState(store, { error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    clear: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.clear().pipe(
            tapResponse({
              next: () => patchState(store, { settings: null, error: null }),
              error: (error) => patchState(store, { error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),

  withHooks({
    onInit(store) {
      store.get();
    },
  }),
);
