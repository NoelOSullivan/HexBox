import { Component, AfterViewInit, Input, ViewChild, ViewChildren, ElementRef } from '@angular/core';

import { ControlsService } from '../../../../shared/services/controls.service';
import { Subscription } from 'rxjs';


import 'hammerjs';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class TimelineComponent implements AfterViewInit {

  @ViewChild('timelineScroller') timelineScroller: ElementRef;

  rightPosition = 0;
  startPositionX: number;
  animateScroller = true;
  wasSwiped = false;
  scrollerWidth: number;

  constructor(private controlsService: ControlsService) { }

  onResize() {
  }

  @Input() timelineYears: object;

  ngOnInit(): void {
    this.controlsService.currentManettePosition.subscribe(position => {
      this.onScroll(position);
      this.animateScroller = false;
      // if (this.openState) {
      //   topHalf.style.top = "-26px";
      //   bottomHalf.style.top = "52px";
      // } else {
      //   topHalf.style.top = "0px";
      //   bottomHalf.style.top = "26px";
      // }
    });
  }

  ngAfterViewInit(): void {
    this.scrollerWidth = this.timelineScroller.nativeElement.clientWidth;
  }

  public onSwipeLeft(evt): void {
    // this.animateScroller = true;
    this.wasSwiped = true;
    this.rightPosition -= 200 * evt.overallVelocityX * 2;
    if (this.rightPosition > 50) {
      this.rightPosition = 50;
    }
    this.timelineScroller.nativeElement.style.right = this.rightPosition + "px";
  }

  public onSwipeRight(evt): void {
    // this.animateScroller = true;
    this.wasSwiped = true;
    this.rightPosition -= 200 * evt.overallVelocityX * 2;
    if (this.rightPosition < (this.timelineScroller.nativeElement.clientWidth * -1) + (window.innerWidth - 70)) {
      this.rightPosition = (this.timelineScroller.nativeElement.clientWidth * -1) + (window.innerWidth - 70);
    }
    this.timelineScroller.nativeElement.style.right = this.rightPosition + "px";
  }

  public onPanStart(evt): void {
    this.animateScroller = false;
    this.startPositionX = evt.center.x;
  }

  public onPanMove(evt): void {
    let newPos = this.rightPosition + (this.startPositionX - evt.center.x);
    if (newPos > 50) {
      newPos = 50;
    }
    if (newPos < (this.timelineScroller.nativeElement.clientWidth * -1) + (window.innerWidth - 70)) {
      newPos = (this.timelineScroller.nativeElement.clientWidth * -1) + (window.innerWidth - 70);
    }
    this.timelineScroller.nativeElement.style.right = newPos + "px";
  }

  public onPanEnd(evt): void {
    this.animateScroller = true;
    const newPos = this.rightPosition + (this.startPositionX - evt.center.x);
    this.rightPosition = newPos;
    // }
  }

  public onScroll(position) {
    if (this.timelineScroller) {
      this.rightPosition += position;
      if (this.rightPosition > 50) {
        this.rightPosition = 50;
      } else {
        if (this.rightPosition < (this.timelineScroller.nativeElement.clientWidth * -1) + (window.innerWidth - 70)) {
          this.rightPosition = (this.timelineScroller.nativeElement.clientWidth * -1) + (window.innerWidth - 70);
        }
      }
      this.timelineScroller.nativeElement.style.right = this.rightPosition + "px";
    }
  }

}