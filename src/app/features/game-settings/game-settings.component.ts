import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';
import { ToolbarActionButton } from '@shared/components/page-wrapper/toolbar-action-button.model';
import { AppStore } from '../../data-access/store/app.store';
import { GameSettingsModel } from '../../data-access/store/models/game-settings.model';
import { RouteNames } from '../../app.routes';
import { TeamModel } from '../../data-access/store/models/team.model';

enum GameSettingsToolbarActions {
  Proceed = 'proceed',
}

interface Form {
  songsAmount: FormControl<number>;
  time: FormControl<number>;
}

@Component({
  selector: 'nap-game-settings',
  imports: [PageWrapperComponent, MatSlider, MatSliderThumb, ReactiveFormsModule],
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSettingsComponent {
  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  private _store = inject(AppStore);

  public readonly routeNames = RouteNames;
  public readonly toolbarActionButtonsConfig: ToolbarActionButton[] = [
    { icon: 'arrow_forward_ios', action: GameSettingsToolbarActions.Proceed },
  ];

  public form: FormGroup<Form> = this._fb.nonNullable.group({
    songsAmount: [20],
    time: [60],
  });

  private _firstTeam: Signal<TeamModel> = computed(() => this._store.teams()[0]);

  public handleActionButtonClick(action: string): void {
    if (action === GameSettingsToolbarActions.Proceed) {
      this._store.setGameInfo({ round: 1, currentTeam: this._firstTeam() });
      this._store.setSettings(this.form.value as GameSettingsModel);
      void this._router.navigate([RouteNames.TeamsRating]);
    }
  }
}
