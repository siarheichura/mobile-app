import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { PageWrapperComponent } from '@shared/components/page-wrapper/page-wrapper.component';
import { ToolbarActionButton } from '@shared/components/page-wrapper/toolbar-action-button.model';
import { AppStore } from '../../data-access/store/app.store';
import { RouteNames } from '../../app.routes';

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

  public handleActionButtonClick(action: string): void {
    if (action === GameSettingsToolbarActions.Proceed) {
      this._store.setSettings(this.form.getRawValue());
      this._store.startGame();
      void this._router.navigate([RouteNames.TeamsRating]);
    }
  }
}
