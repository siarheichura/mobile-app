import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AppStore } from './data-access/store/app.store';

@Component({
  selector: 'nap-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  providers: [AppStore],
})
export class AppComponent implements OnInit {
  private _iconRegistry = inject(MatIconRegistry);
  private _sanitizer = inject(DomSanitizer);

  public ngOnInit(): void {
    this._registerSvgIcons();
  }

  private _registerSvgIcons(): void {
    this._iconRegistry.addSvgIcon(
      'logo',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/logo.svg'),
    );
  }
}
