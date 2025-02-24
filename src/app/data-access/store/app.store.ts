import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UuidService } from '@shared/services/uuid.service';
import { pipe, switchMap, tap, throwError } from 'rxjs';
import { RouteNames } from '../../app.routes';
import { Api } from '../api/api';
import { GameSettingsModel } from '../models/game-settings.model';
import { GameModel } from '../models/game.model';
import { RuleModel } from '../models/rule.model';
import { TeamModel } from '../models/team.model';
import { DEFAULT_SETTINGS } from '../utils/constants/default-settings.constants';
import { RULES } from '../utils/constants/rules.constants';
import { getRandomGuessItem } from '../utils/helpers';

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

  withMethods(
    (store, api = inject(Api), uuidService = inject(UuidService), router = inject(Router)) => ({
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
                guess: null,
                guessed: [],
                skipped: [],
                isPaused: false,
                isStarted: false,
                timer: null,
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
              void router.navigate([RouteNames.Empty]);

              return throwError(() => new Error('Game is not started'));
            }

            return api.setGameInfo({ ...game, isStarted: true, guess: getRandomGuessItem() }).pipe(
              tapResponse({
                next: (game) => patchState(store, { game, error: null }),
                error: (error) => patchState(store, { game: null, error }),
              }),
            );
          }),
        ),
      ),

      guess: rxMethod<void>(
        pipe(
          switchMap(() => {
            const game = store.game();

            if (!game) {
              return throwError(() => new Error('Game is not started'));
            }

            const guessItem = game.guess;

            if (!guessItem) {
              return throwError(() => new Error('No guess item'));
            }

            return api
              .setGameInfo({
                ...game,
                guess: getRandomGuessItem(),
                guessed: [...game.guessed, guessItem],
              })
              .pipe(
                tapResponse({
                  next: (game) => patchState(store, { game, error: null }),
                  error: (error) => patchState(store, { game: null, error }),
                }),
              );
          }),
        ),
      ),

      skip: rxMethod<void>(
        pipe(
          switchMap(() => {
            const game = store.game();

            if (!game) {
              return throwError(() => new Error('Game is not started'));
            }

            const guessItem = game.guess;

            if (!guessItem) {
              return throwError(() => new Error('No guess item'));
            }

            return api
              .setGameInfo({
                ...game,
                guess: getRandomGuessItem(),
                skipped: [...game.skipped, guessItem],
              })
              .pipe(
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

      resumeGame: rxMethod<void>(
        pipe(
          switchMap(() => {
            const game = store.game();

            if (!game) {
              return throwError(() => new Error('Game is not started'));
            }

            return api.setGameInfo({ ...game, isPaused: false }).pipe(
              tapResponse({
                next: (game) => patchState(store, { game, error: null }),
                error: (error) => patchState(store, { game: null, error }),
              }),
            );
          }),
        ),
      ),
    }),
  ),

  withHooks({
    onInit(store) {
      store.getSettings();
      store.getTeams();
      store.getRules();
      store.getGameInfo();
    },
  }),
);

// TODO: timer playground. Remove it later!

// switchMap(() => {
//   return timer(0, 1000).pipe(
//     tap((timer) => {
//       const game = store.game();
//
//       if (!game) {
//         return throwError(() => new Error('Game is not started'));
//       }
//
//       console.log('ttt', timer);
//       console.log('sss', store.settings()?.time);
//       console.log('result', store.settings()?.time! - timer);
//
//       return api.setGameInfo({ ...game, timer: store.settings()?.time! - timer }).pipe(
//         tapResponse({
//           next: (game) => patchState(store, { game, error: null }),
//           error: (error) => patchState(store, { game: null, error }),
//         }),
//       );
//     }),
//   );
// })
