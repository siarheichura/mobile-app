import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, pipe, switchMap, tap, throwError, timer } from 'rxjs';
import { RouteNames } from '../../app.routes';
import { Api } from '../api/api';
import { GameModel } from '../models/game.model';
import { getRandomGuessItem } from '../utils/helpers';
import { GuessItemModel } from '../models/guess-item.model';
import { GameApiService } from '../api/game/game-api.service';
import { AppStore } from './app.store';

export interface GameState {
  round: number;
  currentTeamId: string;
  guess: GuessItemModel | null;
  guessed: GuessItemModel[];
  skipped: GuessItemModel[];
  isStarted: boolean;
  isPaused: boolean;
  timeLeft: number;
  isLoading: boolean;
  error: unknown;
}

const initialState: GameState = {
  round: 0,
  currentTeamId: '',
  guess: null,
  guessed: [],
  skipped: [],
  isStarted: false,
  isPaused: false,
  timeLeft: 0,
  isLoading: false,
  error: null,
};

export const GameStore = signalStore(
  withState<GameState>(initialState),

  withMethods(
    (
      store,
      appStore = inject(AppStore),
      api = inject(GameApiService),
      router = inject(Router),
    ) => ({
      get: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            api.get().pipe(
              switchMap((game) => {
                if (!game) {
                  void router.navigate([RouteNames.Empty]);

                  return throwError(() => new Error('Game is not started'));
                }

                return of(game);
              }),
              tapResponse({
                next: (game) => patchState(store, { ...game, error: null }),
                error: (error) => patchState(store, { ...initialState, error }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      ),

      set: rxMethod<GameModel>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((game) =>
            api.set(game).pipe(
              tapResponse({
                next: () => patchState(store, { ...game, error: null }),
                error: (error) => patchState(store, { ...initialState, error }),
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
                next: () => patchState(store, { ...initialState }),
                error: (error) => patchState(store, { ...initialState, error }),
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
            api.update({ round: 1, timeLeft: appStore.settings()?.time || 0 }).pipe(
              tapResponse({
                next: (game) => patchState(store, { ...game, error: null }),
                error: (error) => patchState(store, { ...initialState, error }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      ),

      letsPlay: rxMethod<void>(
        pipe(
          switchMap(() => {
            return api.set({ isStarted: true, guess: getRandomGuessItem() }).pipe(
              tapResponse({
                next: (game) => patchState(store, { game, error: null }),
                error: (error) => patchState(store, { game: null, error }),
              }),
              switchMap(() => {
                return timer(0, 1000).pipe(
                  switchMap((time) => {
                    console.log('time: ', time);
                    const game = store.game();

                    if (!game) {
                      return throwError(() => new Error('Game is not started'));
                    }

                    return api.setGameInfo({ ...game, timeLeft: game.timeLeft - 1 }).pipe(
                      tapResponse({
                        next: (game) => patchState(store, { game, error: null }),
                        error: (error) => patchState(store, { game: null, error }),
                      }),
                    );
                  }),
                );
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
      store.getGameInfo();
    },
  }),
);
