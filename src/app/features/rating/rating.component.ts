import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { Router } from '@angular/router';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';
import { ToolbarActionButton } from '@shared/components/page-wrapper/toolbar-action-button.model';
import { RouteNames } from '../../app.routes';
import { AppStore } from '../../data-access/store/app.store';

enum ToolbarActions {
  Proceed = 'proceed',
}

@Component({
  selector: 'nap-rating',
  imports: [PageWrapperComponent, MatList, MatListItem, MatIcon],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  private _router = inject(Router);
  public store = inject(AppStore);

  public currentTeam = computed(() => {
    return this.store.teams().find((team) => team.id === this.store.game()?.currentTeamId);
  });

  public readonly toolbarActionButtonsConfig: ToolbarActionButton[] = [
    { icon: 'arrow_forward_ios', action: ToolbarActions.Proceed },
  ];

  protected readonly routeNames = RouteNames;

  public handleActionButtonClick(action: string): void {
    if (action === ToolbarActions.Proceed) {
      void this._router.navigate([RouteNames.Game]);
    }
  }
}
