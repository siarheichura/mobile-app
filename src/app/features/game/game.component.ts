import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';
import { AppStore } from '../../data-access/store/app.store';
import { RouteNames } from '../../app.routes';

@Component({
  selector: 'nap-game',
  imports: [PageWrapperComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private _store = inject(AppStore);

  public currentTeam = computed(() => this._store.currentTeam());
  public game = computed(() => this._store.game());
  public readonly routeNames = RouteNames;
}
