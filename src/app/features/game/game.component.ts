import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { GestureController, GestureDetail, AnimationController } from '@ionic/angular/standalone';
import { RouteNames } from '../../app.routes';
import { AppStore } from '../../data-access/store/app.store';

@Component({
  selector: 'nap-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  #store = inject(AppStore);
  #gestureCtrl = inject(GestureController);
  #animationCtrl = inject(AnimationController);

  cardsEl = viewChild<ElementRef>('cards');

  currentTeam = computed(() => this.#store.currentTeam());
  game = computed(() => this.#store.game());

  readonly routeNames = RouteNames;

  constructor() {
    effect(() => {
      if (this.cardsEl()) {
        this.#createGesture(this.cardsEl()!);
      }
    });
  }

  letsPlay(): void {
    this.#store.letsPlay();
  }

  #createGesture(element: ElementRef) {
    const gesture = this.#gestureCtrl.create({
      el: element.nativeElement,
      direction: 'y',
      threshold: 100,
      onEnd: (detail) => this.#handleMove(detail, element),
      gestureName: 'swipe-up',
    });

    gesture.enable();
  }

  #handleMove(detail: GestureDetail, element: ElementRef): void {
    const animation = this.#animationCtrl
      .create()
      .addElement(element.nativeElement)
      .duration(200)
      .to('transform', `translateY(${detail.deltaY > 0 ? '100px' : '-100px'})`)
      .to('opacity', '0');

    void animation.play();

    animation.onFinish(() => {
      animation.destroy();
    });

    if (detail.deltaY > 0) {
      this.#store.skip();
    } else if (detail.deltaY < 0) {
      this.#store.guess();
    }
  }
}
