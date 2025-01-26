import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../../routes.enum';

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
}
