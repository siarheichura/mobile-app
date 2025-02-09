import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';

@Component({
  selector: 'nap-game',
  imports: [PageWrapperComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {}
