import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';
import { ToolbarActionButton } from '@shared/components/page-wrapper/toolbar-action-button.model';
import { RouteNames } from '../../routes.enum';
import { TeamsStore } from './data-access/store/teams.store';
import { ToolbarActions } from './data-access/enums/toolbar-actions';

@Component({
  selector: 'nap-teams-settings',
  imports: [PageWrapperComponent, MatList, MatListItem, MatIcon, MatIconButton],
  templateUrl: './teams-settings.component.html',
  styleUrl: './teams-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsSettingsComponent {
  private _router = inject(Router);
  public store = inject(TeamsStore);

  public readonly routeNames = RouteNames;
  public readonly toolbarActionButtonsConfig: ToolbarActionButton[] = [
    { icon: 'add', action: ToolbarActions.AddTeam },
    { icon: 'arrow_forward_ios', action: ToolbarActions.Proceed },
  ];

  public handleActionButtonClick(action: string): void {
    if (action === ToolbarActions.AddTeam) {
      this._handleAddTeam();
    } else if (action === ToolbarActions.Proceed) {
      this._handleProceed();
    }
  }

  public handleRemoveTeam(id: string): void {
    this.store.removeTeam(id);
  }

  private _handleAddTeam(): void {
    this.store.addTeam();
  }

  private _handleProceed(): void {
    void this._router.navigate([RouteNames.GameSettings]);
  }
}
