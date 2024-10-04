import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf, NgClass } from '@angular/common';
import { Select, Store } from '@ngxs/store';

import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { ArrowComponent } from '../../../../../shared/components/arrow/arrow.component';
import { DirectAccessComponent } from '../../../../../shared/components/direct-access/direct-access.component';
import { SwipeIconComponent } from '../../../../../shared/components/swipe-icon/swipe-icon.component';

import { Direction } from '../../../../../shared/interfaces/panel';
import { TurnPage } from '../../../../../store/panel/panel.action';

import { AppState } from 'app/store/general/general.state';
import { AppStateModel } from 'app/store/general/general.model';
import { ChangeAppState } from 'app/store/general/general.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-container1',
  standalone: true,
  imports: [NgIf, NgClass, ContentDirective, LogoComponent, ArrowComponent, DirectAccessComponent, SwipeIconComponent],
  templateUrl: './container1.component.html',
  styleUrls: ['./container1.component.scss', '../../main-sections-shared-styles.scss']
})

export class Container1 implements OnInit {

  @Select(AppState) appState$!: Observable<AppStateModel>;

  @Input() nContainer!: number;

  @ViewChild('video1') video1!: ElementRef;
  @ViewChild('video2') video2!: ElementRef;
  @ViewChild('video3') video3!: ElementRef;

  constructor(private store: Store) { }

  onIntro!: boolean;
  onFinIntro: boolean = false;
  onFingerAnim: boolean = false;

  done1: boolean = false;
  done2: boolean = false;
  done3: boolean = false;
  showSwipe: boolean = false;

  appState!: AppStateModel;

  ngOnInit(): void {
    this.appState$.subscribe(newAppState => {
      this.appState = newAppState;
      this.onIntro = this.appState.appState.onIntro;
      if (this.video1) {
        this.video1.nativeElement.removeEventListener('timeupdate', this.timeCheckVideo1);
        this.video1.nativeElement.style.visibility = "hidden";
      }
      if (this.video2) {
        this.video2.nativeElement.removeEventListener('timeupdate', this.timeCheckVideo2);
        this.video2.nativeElement.style.visibility = "hidden";
      }
      if (this.video3) {
        this.video3.nativeElement.removeEventListener('timeupdate', this.timeCheckVideo3);
        this.video3.nativeElement.style.visibility = "hidden";
      }
      this.onFinIntro = true;
      this.done1 = true;
      this.done2 = true;
      this.done3 = true;
    });
  }

  ngAfterViewInit(): void {
    this.video1.nativeElement.muted = true;
    this.video1.nativeElement.play();
    this.video1.nativeElement.addEventListener('timeupdate', () => {
      this.timeCheckVideo1();
    });

    this.video3.nativeElement.style.visibility = "hidden";
    this.video3.nativeElement.pause();
  }

  timeCheckVideo1() {
    if (!this.done1) {
      // console.log("timeCheckVideo1", this.video1.nativeElement.currentTime);
      if (this.video1.nativeElement.currentTime > 4) {
        this.showSwipe = true;
      }
      if (this.video1.nativeElement.currentTime > 8) {
        this.done1 = true;
        this.video1.nativeElement.removeEventListener('timeupdate', this.timeCheckVideo1);
        this.flipIntro();
      }
    }
  }

  flipIntro(): void {
    // console.log("flipIntro");
    const directionObj: Direction = { direction: "left" };
    this.store.dispatch(new TurnPage(directionObj));

    this.video2.nativeElement.muted = true;
    this.video2.nativeElement.play();
    this.video2.nativeElement.addEventListener('timeupdate', () => {
      this.timeCheckVideo2();
    });
  }

  timeCheckVideo2() {
    if (!this.done2) {
      // console.log("timeCheckVideo2", this.video2.nativeElement.currentTime);
      if (this.video2.nativeElement.currentTime > 4.5) {
        this.done2 = true;
        this.video2.nativeElement.removeEventListener('timeupdate', this.timeCheckVideo2);
        this.flipIntroBack();
      }
    }
  }

  flipIntroBack(): void {
    // console.log("flipIntroBack");
    const directionObj: Direction = { direction: "right" };
    this.store.dispatch(new TurnPage(directionObj));

    this.video1.nativeElement.style.visibility = "hidden";

    this.video3.nativeElement.muted = true;
    this.video3.nativeElement.style.visibility = "visible";
    this.video3.nativeElement.currentTime = 2;
    this.video3.nativeElement.play();

    this.video3.nativeElement.addEventListener('timeupdate', () => {
      this.timeCheckVideo3();
    });
  }

  timeCheckVideo3() {
    if (!this.done3) {
      // console.log("timeCheckVideo3", this.video3.nativeElement.currentTime);
      if (this.onFingerAnim === false && this.video3.nativeElement.currentTime > 0.75) {
        this.onFingerAnim = true;
      }
      if (this.video3.nativeElement.currentTime > 8.7) {
        this.done3 = true;
        this.finIntro();
        this.video3.nativeElement.removeEventListener('timeupdate', this.timeCheckVideo3);
      }
    }
  }

  finIntro() {
    this.onFinIntro = true;
    let appState: AppStateModel;
    appState = { appState: { onIntro: false, mouseUpDetected: this.appState.appState.mouseUpDetected } };
    this.store.dispatch(new ChangeAppState(appState.appState));
  }


}
