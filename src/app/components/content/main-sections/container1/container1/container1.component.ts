import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf, NgClass } from '@angular/common';
import { Select, Store } from '@ngxs/store';

import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { DirectAccessComponent } from '../../../../../shared/components/direct-access/direct-access.component';
import { SwipeIconComponent } from '../../../../../shared/components/swipe-icon/swipe-icon.component';

import { Direction } from '../../../../../shared/interfaces/panel';
import { TurnPage } from '../../../../../store/panel/panel.action';

import { AppState } from 'app/store/general/general.state';
import { AppStateModel, IntroState, LanguageModel } from 'app/store/general/general.model';
import { ChangeIntroState } from 'app/store/general/general.actions';
import { Observable } from 'rxjs';
import { Language } from 'app/store/general/general.state';
import { NextPageButtonComponent } from 'app/shared/components/next-page-button/next-page-button.component';
import { BichromeTitleComponent } from 'app/shared/components/bichrome-title/bichrome-title.component';

@Component({
  selector: 'app-container1',
  standalone: true,
  imports: [NgIf, NgClass, ContentDirective, LogoComponent, BichromeTitleComponent, DirectAccessComponent, SwipeIconComponent, NextPageButtonComponent],
  templateUrl: './container1.component.html',
  styleUrls: ['./container1.component.scss', '../../main-sections-shared-styles.scss']
})

export class Container1 implements OnInit {

  @Select(AppState) appState$!: Observable<AppStateModel>;
  @Select(Language) language$!: Observable<LanguageModel>;

  @Input() nContainer!: number;

  @ViewChild('video1') video1!: ElementRef;
  @ViewChild('video2') video2!: ElementRef;
  @ViewChild('video3') video3!: ElementRef;
  @ViewChild('videoHolder') videoHolder!: ElementRef;

  constructor(private store: Store) { }

  onFingerAnim: boolean = false;

  done1: boolean = false;
  done2: boolean = false;
  done3: boolean = false;
  showSwipe: boolean = false;
  activePageNum: number = 0;
  isLastPage: boolean = false;

  appState!: AppStateModel;
  introState!: IntroState;
  videosFinished: boolean = false;
  language!: string;
  introDone: boolean = false;

  changePageNum(activePageNum: number) {
    if(this.activePageNum !== activePageNum) {
      this.activePageNum = activePageNum;
    }
  }

  setIsLastPage(isLastPage: boolean) {
    this.isLastPage = isLastPage;
  }

  ngOnInit(): void {
    this.appState$.subscribe(newAppState => {
      this.appState = newAppState;
      this.introState = this.appState.introState;
      if (this.introState === 'onFinalAnim' && this.introDone === false) {
        this.introDone = true;
        this.video1.nativeElement.removeEventListener('ended', this.endVideo1);
        this.video2.nativeElement.removeEventListener('ended', this.endVideo2);
        this.video3.nativeElement.removeEventListener('ended', this.endVideo3);
        this.showSwipe = false;
        // If the intro was cut by the user and we are on the 2nd page, go back to page 1
        if (this.activePageNum === 1) {
          const directionObj: Direction = { direction: "right" };
          this.store.dispatch(new TurnPage(directionObj));
        }
        setTimeout(() => {
          this.store.dispatch(new ChangeIntroState(IntroState.DONE));
        }, 500);

      }
      if (this.introState === 'done' && !this.videosFinished) {
        this.videosFinished = true;
        if (this.video1) {
          this.video1.nativeElement.style.visibility = "hidden";
        }
        if (this.video2) {
          this.video2.nativeElement.style.visibility = "hidden";
        }
        if (this.video3) {
          this.video3.nativeElement.style.visibility = "hidden";
        }
        this.done1 = true;
        this.done2 = true;
        this.done3 = true;
      }
    });

    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language
    });
  }

  ngAfterViewInit(): void {
    this.video1.nativeElement.load();

    let that = this;
    this.video1.nativeElement.addEventListener('loadeddata', function () {
      // Video is loaded and can be played
      const holderHeight = that.videoHolder.nativeElement.clientHeight;
      const videoHeight = that.video1.nativeElement.clientHeight;

      if (videoHeight > holderHeight) {
        that.video1.nativeElement.style.marginTop = -(Math.min(videoHeight - holderHeight, 70)) + "px";
        that.video2.nativeElement.style.marginTop = -(Math.min(videoHeight - holderHeight, 70)) + "px";
        that.video3.nativeElement.style.marginTop = -(Math.min(videoHeight - holderHeight, 70)) + "px";
      }

      that.video1.nativeElement.muted = true;
      that.video1.nativeElement.play();

      setTimeout(() => {
        that.showSwipe = true;
      }, 2000);

      that.video1.nativeElement.addEventListener("ended", () => {
        that.endVideo1();
      });
    }, false);

    this.video3.nativeElement.style.visibility = "hidden";
    this.video3.nativeElement.pause();

  }

  endVideo1() {
    if (this.introDone === false) {
      this.done1 = true;
      this.video1.nativeElement.removeEventListener('ended', this);
      this.flipIntro();
    }
  }

  flipIntro(): void {
    const directionObj: Direction = { direction: "left" };
    this.store.dispatch(new TurnPage(directionObj));

    this.video2.nativeElement.muted = true;
    this.video2.nativeElement.play();

    this.video2.nativeElement.addEventListener("ended", () => {
      this.endVideo2();
    });
  }

  endVideo2() {
    this.done2 = true;
    this.video2.nativeElement.removeEventListener('ended', this);
    this.flipIntroBack();
  }

  flipIntroBack(): void {
    const directionObj: Direction = { direction: "right" };
    this.store.dispatch(new TurnPage(directionObj));

    this.video1.nativeElement.style.visibility = "hidden";

    this.video3.nativeElement.muted = true;
    this.video3.nativeElement.style.visibility = "visible";
    this.video3.nativeElement.play();

    this.onFingerAnim = true;

    this.video3.nativeElement.addEventListener("ended", () => {
      this.endVideo3();
    });
  }

  endVideo3() {
    this.done3 = true;
    this.video3.nativeElement.removeEventListener('ended', this);
    this.finIntro();
  }

  finIntro() {
    this.store.dispatch(new ChangeIntroState(IntroState.ONFINALANIM));
    setTimeout(() => {
      this.store.dispatch(new ChangeIntroState(IntroState.DONE));
    }, 500);
  }

}
