import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'nap-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {}
