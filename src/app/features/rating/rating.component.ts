import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';
import { ToolbarActionButton } from '@shared/components/page-wrapper/toolbar-action-button.model';
import { RouteNames } from '../../app.routes';

enum ToolbarActions {
  Proceed = 'proceed',
}

@Component({
  selector: 'nap-rating',
  imports: [PageWrapperComponent],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  private _router = inject(Router);

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
