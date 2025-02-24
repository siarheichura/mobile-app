import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';
import { RouteNames } from '../../app.routes';
import { AppStore } from '../../data-access/store/app.store';

@Component({
  selector: 'nap-rules',
  imports: [MatIcon, PageWrapperComponent],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {
  public store = inject(AppStore);

  public readonly routeNames = RouteNames;
}
