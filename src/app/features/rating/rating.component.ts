import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
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

  protected readonly routeNames = RouteNames;

  public readonly toolbarActionButtonsConfig: ToolbarActionButton[] = [
    { icon: 'arrow_forward_ios', action: ToolbarActions.Proceed },
  ];

  public handleActionButtonClick(action: string): void {
    if (action === ToolbarActions.Proceed) {
      void this._router.navigate([RouteNames.Game]);
    }
  }
}
