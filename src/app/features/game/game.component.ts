import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  viewChildren,
} from '@angular/core';
import { GestureController, GestureDetail, AnimationController } from '@ionic/angular/standalone';
import { AppStore } from '../../data-access/store/app.store';
import { RouteNames } from '../../app.routes';

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

  cards = viewChildren<ElementRef>('card');

  currentTeam = computed(() => this.#store.currentTeam());
  game = computed(() => this.#store.game());

  readonly routeNames = RouteNames;

  constructor() {
    effect(() => {
      this.cards().forEach((card) => {
        this.#createGesture(card);
      });
    });
  }

  letsPlay(): void {
    this.#store.letsPlay();
  }

  #createGesture(element: ElementRef) {
    const gesture = this.#gestureCtrl.create({
      el: element.nativeElement,
      direction: 'y',
      threshold: 50,
      onMove: (detail) => this.#handleMove(detail, element),
      gestureName: 'swipe-up',
    });

    gesture.enable();
  }

  #handleMove(detail: GestureDetail, element: ElementRef): void {
    void this.#animationCtrl
      .create()
      .addElement(element.nativeElement)
      .duration(100)
      .fromTo(
        'transform',
        'translateY(0px)',
        `translateY(${detail.deltaY > 0 ? '100px' : '-100px'}`,
      )
      .fromTo('opacity', '1', '0')
      .play();
  }
}
