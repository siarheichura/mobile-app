import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../routes.enum';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-main',
  imports: [MatButton, RouterLink, MatIcon],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  public readonly RouteNames = RouteNames;
}
