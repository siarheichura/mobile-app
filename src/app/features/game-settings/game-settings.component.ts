import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteNames } from '../../routes.enum';

@Component({
  selector: 'nap-game-settings',
  imports: [RouterLink],
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSettingsComponent {
  public readonly routeNames = RouteNames;
}
