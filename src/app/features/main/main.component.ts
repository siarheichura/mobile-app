import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { RouteNames } from '../../routes.enum';

@Component({
  selector: 'nap-main',
  imports: [MatButton, RouterLink, MatIcon],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  public readonly routeNames = RouteNames;
}
