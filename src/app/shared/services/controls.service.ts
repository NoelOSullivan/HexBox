import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export class ControlsService {

  constructor() { }

  private leftButtonClickSource = new Subject<string>();
  private rightButtonClickSource = new Subject<string>();
  private manageButtonSlidersSource = new Subject<boolean>();
  private disableButtonSource = new Subject<string>();
  private enableButtonSource = new Subject<string>();

  private scrollerOpen = new BehaviorSubject(false);
  currentOpenState = this.scrollerOpen.asObservable();

  private manettePosition = new BehaviorSubject(0);
  currentManettePosition = this.manettePosition.asObservable();

  leftButtonClick$ = this.leftButtonClickSource.asObservable();
  rightButtonClick$ = this.rightButtonClickSource.asObservable();
  manageButtonSliders$ = this.manageButtonSlidersSource.asObservable();
  disableButton$ = this.disableButtonSource.asObservable();
  enableButton$ = this.enableButtonSource.asObservable();

  manageScroller(openScroller:boolean) {
      this.scrollerOpen.next(openScroller);
  }

  manageManette(manettePosition:number) {
    this.manettePosition.next(manettePosition);
}

  clickLeftButton() {
    // this.leftButtonClickSource.next();
  }

  clickRightButton() {
    // this.rightButtonClickSource.next();
  }

  manageButtonSliders(open: boolean) {
    this.manageButtonSlidersSource.next(open);
  }

  disableButton(button: string) {
    this.disableButtonSource.next(button);
  }

  enableButton(button: string) {
    this.enableButtonSource.next(button);
  }

}