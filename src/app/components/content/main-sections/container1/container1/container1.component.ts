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
import { ChangeOnIntro } from 'app/store/general/general.actions';
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
  @ViewChild('videoHolder') videoHolder!: ElementRef;

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
      if (this.onIntro === false) {
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
        if (this.done1 === true && this.done2 === false) {
          const directionObj: Direction = { direction: "right" };
          this.store.dispatch(new TurnPage(directionObj));
        }
        this.onFinIntro = true;
        this.done1 = true;
        this.done2 = true;
        this.done3 = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.video1.nativeElement.load();

    let that = this;
    this.video1.nativeElement.addEventListener('loadeddata', function () {
      // Video is loaded and can be played
      console.log("VH", that.videoHolder.nativeElement.clientHeight);
      console.log("V", that.video1.nativeElement.clientHeight);
      const holderHeight = that.videoHolder.nativeElement.clientHeight;
      const videoHeight = that.video1.nativeElement.clientHeight;

      if(videoHeight > holderHeight) {
        console.log(Math.min(videoHeight-holderHeight,50));
        that.video1.nativeElement.style.marginTop = -(Math.min(videoHeight-holderHeight,70))+"px";
        that.video2.nativeElement.style.marginTop = -(Math.min(videoHeight-holderHeight,70))+"px";
        that.video3.nativeElement.style.marginTop = -(Math.min(videoHeight-holderHeight,70))+"px";
      }

      that.video1.nativeElement.muted = true;
      that.video1.nativeElement.currentTime = 2;
      that.video1.nativeElement.play();
    }, false);


    this.video1.nativeElement.addEventListener('timeupdate', () => {
      this.timeCheckVideo1();
    });

    this.video3.nativeElement.style.visibility = "hidden";
    this.video3.nativeElement.pause();


  }

  timeCheckVideo1() {
    if (!this.done1) {
      if (this.video1.nativeElement.currentTime > 3.9) {
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
    const directionObj: Direction = { direction: "left" };
    this.store.dispatch(new TurnPage(directionObj));

    this.video2.nativeElement.muted = true;
    this.video2.nativeElement.currentTime = 1;
    this.video2.nativeElement.play();
    this.video2.nativeElement.addEventListener('timeupdate', () => {
      this.timeCheckVideo2();
    });
  }

  timeCheckVideo2() {
    if (!this.done2) {
      if (this.video2.nativeElement.currentTime > 4.5) {
        this.done2 = true;
        this.video2.nativeElement.removeEventListener('timeupdate', this.timeCheckVideo2);
        this.flipIntroBack();
      }
    }
  }

  flipIntroBack(): void {
    const directionObj: Direction = { direction: "right" };
    this.store.dispatch(new TurnPage(directionObj));

    this.video1.nativeElement.style.visibility = "hidden";

    this.video3.nativeElement.muted = true;
    this.video3.nativeElement.style.visibility = "visible";
    this.video3.nativeElement.currentTime = 3;
    this.video3.nativeElement.play();

    this.video3.nativeElement.addEventListener('timeupdate', () => {
      this.timeCheckVideo3();
    });
  }

  timeCheckVideo3() {
    if (!this.done3) {
      if (this.onFingerAnim === false && this.video3.nativeElement.currentTime > 0.5) {
        this.onFingerAnim = true;
      }
      if (this.video3.nativeElement.currentTime > 8.9) {
        this.showSwipe = false;
        this.done3 = true;
        this.finIntro();
        this.video3.nativeElement.removeEventListener('timeupdate', this.timeCheckVideo3);
      }
    }
  }

  finIntro() {
    this.onFinIntro = true;
    setTimeout(() => {
      this.store.dispatch(new ChangeOnIntro(false));
    }, 500);

  }
}
