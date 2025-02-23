import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, throwError } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { UuidService } from '@shared/services/uuid.service';
import { Api } from '../api/api';
import { TeamModel } from '../models/team.model';
import { GameSettingsModel } from '../models/game-settings.model';
import { RuleModel } from '../models/rule.model';
import { DEFAULT_SETTINGS } from '../utils/default-settings.constants';
import { GameModel } from '../models/game.model';
import { RULES } from '../utils/rules.constants';

export interface AppState {
  teams: TeamModel[];
  settings: GameSettingsModel | null;
  rules: RuleModel[];
  game: GameModel | null;
  isLoading: boolean | null;
  error: unknown | null;
}

const initialState: AppState = {
  teams: [],
  settings: null,
  rules: [],
  game: null,
  isLoading: null,
  error: null,
};

export const AppStore = signalStore(
  withState<AppState>(initialState),

  withComputed((store) => ({
    firstTeam: computed(() => store.teams()[0]),

    currentTeam: computed(() =>
      store.teams().find((team) => team.id === store.game()?.currentTeamId),
    ),
  })),

  withMethods((store, api = inject(Api), uuidService = inject(UuidService)) => ({
    getSettings: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.getSettings().pipe(
            tapResponse({
              next: (settings) =>
                patchState(store, { settings: settings || DEFAULT_SETTINGS, error: null }),
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
              next: (settings) => patchState(store, { settings, error: null }),
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
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.setTeams(store.teams()).pipe(
            tapResponse({
              next: (teams) =>
                patchState(store, {
                  teams: [
                    ...teams,
                    { name: api.getRandomTeamName(), id: uuidService.uuid(), score: 0 },
                  ],
                  error: null,
                }),
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
      patchState(store, { rules: RULES });
    },

    getGameInfo: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.getGameInfo().pipe(
            tapResponse({
              next: (game) => patchState(store, { game, error: null }),
              error: (error) => patchState(store, { game: null, error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    setGameInfo: rxMethod<GameModel>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((game) =>
          api.setGameInfo(game).pipe(
            tapResponse({
              next: () => patchState(store, { game, error: null }),
              error: (error) => patchState(store, { game: null, error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    clearGameInfo: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.clearGameInfo().pipe(
            tapResponse({
              next: () => patchState(store, { game: null, error: null }),
              error: (error) => patchState(store, { game: null, error }),
              finalize: () => patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),

    startGame: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api
            .setGameInfo({
              round: 1,
              currentTeamId: store.firstTeam()?.id,
              toGuess: null,
              guessed: [],
              skipped: [],
              isPaused: false,
              isStarted: false,
            })
            .pipe(
              tapResponse({
                next: (game) => patchState(store, { game, error: null }),
                error: (error) => patchState(store, { game: null, error }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
        ),
      ),
    ),

    letsPlay: rxMethod<void>(
      pipe(
        switchMap(() => {
          const game = store.game();

          if (!game) {
            return throwError(() => new Error('Game is not started'));
          }

          return api.setGameInfo({ ...game, isStarted: true }).pipe(
            tapResponse({
              next: (game) => patchState(store, { game, error: null }),
              error: (error) => patchState(store, { game: null, error }),
            }),
          );
        }),
      ),
    ),

    pauseGame: rxMethod<void>(
      pipe(
        switchMap(() => {
          const game = store.game();

          if (!game) {
            return throwError(() => new Error('Game is not started'));
          }

          return api.setGameInfo({ ...game, isPaused: true }).pipe(
            tapResponse({
              next: (game) => patchState(store, { game, error: null }),
              error: (error) => patchState(store, { game: null, error }),
            }),
          );
        }),
      ),
    ),
  })),

  withHooks({
    onInit(store) {
      store.getSettings();
      store.getTeams();
      store.getRules();
      store.getGameInfo();
    },
  }),
);
