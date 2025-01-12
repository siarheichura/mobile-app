import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { RouteNames } from '../../routes.enum';
import { Rule } from './rule.model';

@Component({
  selector: 'nap-rules',
  imports: [RouterLink, MatIcon, MatToolbar, MatIconButton],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {
  public readonly routeNames = RouteNames;

  public readonly rules: Rule[] = [
    {
      id: 1,
      icon: 'task_alt',
      text: 'Задача игрока - за отведенное время указанным звуком напеть мелодию из указанной песни товарищам по команде.',
    },
    {
      id: 2,
      icon: 'stars',
      text: 'Отгаданная песня приносит команде одно очко. Пропущенная песня не приносит ничего.',
    },
    {
      id: 3,
      icon: 'cancel',
      text: 'Во время выполнения задания нельзя издавать никаких звуков кроме указанного.',
    },
    {
      id: 4,
      icon: 'emoji_events',
      text: 'Победителем становится команда, у которой первой количество очков достигло указанного перед началом игры значения',
    },
  ];
}
