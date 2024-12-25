import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteNames } from '../../routes.enum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rules',
  imports: [RouterLink],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {
  public readonly RouteNames = RouteNames;
}
