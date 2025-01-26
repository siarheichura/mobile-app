import { Routes } from '@angular/router';
import { RouteNames } from './routes.enum';

export const routes: Routes = [
  {
    path: RouteNames.Empty,
    title: 'Главная',
    loadComponent: () => import('./features/main/main.component').then((c) => c.MainComponent),
  },
  {
    path: RouteNames.Rules,
    title: 'Правила',
    loadComponent: () => import('./features/rules/rules.component').then((c) => c.RulesComponent),
  },
  {
    path: RouteNames.TeamsSettings,
    loadComponent: () => import('./features/teams-settings/teams-settings.component').then((c) => c.TeamsSettingsComponent),
  },
  {
    path: RouteNames.GameSettings,
    loadComponent: () => import('./features/game-settings/game-settings.component').then((c) => c.GameSettingsComponent),
  },
  {
    path: RouteNames.Game,
    loadComponent: () => import('./features/game/game.component').then((c) => c.GameComponent),
  },
];
