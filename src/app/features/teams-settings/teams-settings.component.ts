import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteNames } from '../../routes.enum';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';

@Component({
  selector: 'nap-teams-settings',
  imports: [PageWrapperComponent],
  templateUrl: './teams-settings.component.html',
  styleUrl: './teams-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsSettingsComponent {
  protected readonly routeNames = RouteNames;
}
