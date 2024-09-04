import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf, NgClass } from '@angular/common';
import { Store } from '@ngxs/store';

import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { ArrowComponent } from '../../../../../shared/components/arrow/arrow.component';
import { DirectAccessComponent } from '../../../../../shared/components/direct-access/direct-access.component';
import { SwipeIconComponent } from '../../../../../shared/components/swipe-icon/swipe-icon.component';

import { Direction } from '../../../../../shared/interfaces/panel';
import { TurnPage } from '../../../../../store/panel/panel.action';

@Component({
  selector: 'app-container1',
  standalone: true,
  imports: [NgIf, NgClass, ContentDirective, LogoComponent, ArrowComponent, DirectAccessComponent, SwipeIconComponent],
  templateUrl: './container1.component.html',
  styleUrls: ['./container1.component.scss', '../../main-sections-shared-styles.scss']
})

export class Container1 {

  @ViewChild('video1') video1!: ElementRef;
  @ViewChild('video2') video2!: ElementRef;
  @ViewChild('video3') video3!: ElementRef;

  constructor(private store: Store) { }

  onIntro: boolean = true;
  onFinIntro: boolean = false;

  ngAfterViewInit(): void {

    const video = this.video1.nativeElement;
    video.muted = true;
    video.play();

    const video3 = this.video3.nativeElement;
    video3.style.visibility = "hidden";

    setTimeout(() => {
      this.flipIntro();
    }, 9000);
  }

  flipIntro(): void {
    console.log("FI");

    const directionObj: Direction = { direction: "left" };
    this.store.dispatch(new TurnPage(directionObj));

    const video = this.video2.nativeElement;
    video.muted = true;
    video.play();

    setTimeout(() => {
      this.flipBack();
    }, 5000);
  }

  flipBack(): void {
    console.log("FB");

    const directionObj: Direction = { direction: "right" };
    this.store.dispatch(new TurnPage(directionObj));

    const video1 = this.video1.nativeElement;
    video1.style.visibility = "hidden";

    const video3 = this.video3.nativeElement;
    video3.muted = true;
    video3.style.visibility = "visible";
    video3.play(1);

    setTimeout(() => {
      this.finIntro();
    }, 3000);
  }

  finIntro() {
    this.onFinIntro = true;
    setTimeout(() => {
      this.onIntro = false;
    }, 2000);
  }



}
