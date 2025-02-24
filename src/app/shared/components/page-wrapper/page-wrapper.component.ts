import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../../app.routes';
import { ToolbarActionButton } from './toolbar-action-button.model';

@Component({
  selector: 'nap-page-wrapper',
  imports: [MatIcon, MatIconButton, MatToolbar, RouterLink],
  templateUrl: './page-wrapper.component.html',
  styleUrl: './page-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageWrapperComponent {
  public withToolbar = input<boolean>(false);
  public title = input<string>();
  public backButtonRoute = input<RouteNames>();
  public actionButtons = input<ToolbarActionButton[]>();

  public actionButtonClicked = output<string>();
}
