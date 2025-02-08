import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';
import { ToolbarActionButton } from '@shared/components/page-wrapper/toolbar-action-button.model';
import { GameSettingsStore } from '@features/game-settings/data-access/store/game-settings.store';
import { GameSettingsModel } from '@features/game-settings/data-access/store/models/game-settings.model';
import { GameSettingsToolbarActions } from '@features/game-settings/data-access/enums/game-settings-toolbar-actions';
import { RouteNames } from '../../routes.enum';

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
  public store = inject(GameSettingsStore);

  public readonly routeNames = RouteNames;
  public readonly toolbarActionButtonsConfig: ToolbarActionButton[] = [
    { icon: 'arrow_forward_ios', action: GameSettingsToolbarActions.Proceed },
  ];

  public form: FormGroup<Form> = this._fb.nonNullable.group({
    songsAmount: [20],
    time: [60],
  });

  private readonly _defaultSettings: GameSettingsModel = {
    songsAmount: 20,
    time: 60,
  };

  constructor() {
    effect(() => {
      this._setInitialFormValue();
    });
  }

  public handleActionButtonClick(action: string): void {
    if (action === GameSettingsToolbarActions.Proceed) {
      this._handleProceed();
    }
  }

  private _setInitialFormValue(): void {
    this.form.patchValue({
      songsAmount: this.store.settings()?.songsAmount || this._defaultSettings.songsAmount,
      time: this.store.settings()?.time || this._defaultSettings.time,
    });
  }

  private _handleProceed(): void {
    this.store.set(this.form.value as GameSettingsModel);

    void this._router.navigate([RouteNames.Game]);
  }
}
