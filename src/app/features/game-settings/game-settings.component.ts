import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteNames } from '../../routes.enum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-settings',
  imports: [RouterLink],
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSettingsComponent {
  public readonly RouteNames = RouteNames;
}
