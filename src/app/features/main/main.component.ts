import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { RouteNames } from '../../app.routes';
import { AppStore } from '../../data-access/store/app.store';

@Component({
  selector: 'nap-main',
  imports: [MatButton, RouterLink, MatIcon],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private _store = inject(AppStore);

  public isGameExists: Signal<boolean> = computed(() => !!this._store.game());

  public readonly routeNames = RouteNames;
}
