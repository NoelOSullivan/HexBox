import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Store } from '@ngxs/store';

import { Rotation } from '../interfaces/hexagon';
import { InitPageTotals, UpdatePageCounter } from '../../store/page/page.action';

@Directive({
  selector: '[appSwipe]',
  exportAs: 'AppSwipe',
  standalone: true
})

export class ContentDirective {

  @Input() nPanel!: string;

  lastX!: number;
  rotation: Rotation = { degrees: 0 };
  nPages!: number;
  count: number = 0;
  maxRotation!: number;
  touchStartTime!: number;
  touchEndTime!: number;
  touchStartX!: number;
  touchEndX!: number;
  endInterval: any;
  finalAnimRotation!: number;
  swipeDirection!: String;
  finalAnimDirection!: String;
  blockInteraction: boolean = false;

  counter: number = 0;

  constructor(private panel: ElementRef, private store: Store) { }

  ngAfterViewInit() {

    // Count the number of pages in the panel
    this.nPages = this.panel.nativeElement.children.length;
    this.maxRotation = (this.nPages - 1) * -180;

    for (let i = 2; i < this.nPages; i++) {
      this.panel.nativeElement.children[i].style.display = 'none';
    }

    const payload = { panelNumber: Number(this.nPanel), totalPages: this.nPages }
    this.store.dispatch(new InitPageTotals(payload));

  }

  @HostListener('wheel', ['$event']) wheel(event: WheelEvent) {
    
    if (!this.blockInteraction) {
      if (event.deltaY > 0) {
        if (this.rotation.degrees > this.maxRotation) {
          this.blockInteraction = true;
          this.swipeDirection = "left"
          this.finalAnimRotation = this.rotation.degrees - 180;
          this.finishFlipToCalculatedPage();
        }
      } else {
        if (this.rotation.degrees < 0) {
          this.blockInteraction = true;
          this.swipeDirection = "right"
          this.finalAnimRotation = this.rotation.degrees + 180;
          this.finishFlipToCalculatedPage();
        }
      }
    }
  }

  @HostListener('touchstart', ['$event']) touchstart(event: TouchEvent) {

    this.lastX = this.touchStartX = event.changedTouches[0].clientX;
    this.touchStartTime = event.timeStamp;

  }

  @HostListener('touchmove', ['$event']) touchmove(event: TouchEvent) {

    // Detect movement of finger since last event
    const diffX = this.lastX - event.targetTouches[0].clientX;
    this.lastX = event.targetTouches[0].clientX;

    // If swiping right calculate new rotation if not yet minimum value (0)
    // TO DO : 3 is arbitary. Maybe find a rule.
    if (diffX < 0) {
      if (this.rotation.degrees < 0) {
        this.rotation.degrees -= diffX * 3;
      }
    } else {
      // If swiping left calculate new rotation if not yet maximum value (this.maxRotation)
      if (diffX > 0) {
        if (this.rotation.degrees > this.maxRotation) {
          this.rotation.degrees -= diffX * 3;
        }
      }
    }

    this.managePanelDisplay();

  }

  @HostListener('touchend', ['$event']) touchend(event: TouchEvent) {

    this.touchEndX = event.changedTouches[0].clientX;
    this.touchEndTime = event.timeStamp;

    if (this.touchEndX < this.touchStartX) {
      this.swipeDirection = "left"
    } else {
      if (this.touchEndX > this.touchStartX) {
        this.swipeDirection = "right"
      }
    }

    // Calculate the final degrees that will be flipped to
    this.finalAnimRotation = Math.round(this.rotation.degrees / 180) * 180;
    this.finishFlipToCalculatedPage();

  }


  finishFlipToCalculatedPage() {

    if (this.finalAnimRotation < this.rotation.degrees) {
      this.finalAnimDirection = "left";
    } else {
      if (this.finalAnimRotation > this.rotation.degrees) {
        this.finalAnimDirection = "right";
      }
    }

    // TODO : try to avoid this interval
    this.endInterval = setInterval(() => {
      this.finishFlip();
    }, 5);

  }

  finishFlip() {

    if (this.finalAnimDirection === "left") {
      this.rotation.degrees -= 5;
    } else {
      if (this.finalAnimDirection === "right") {
        this.rotation.degrees += 5;
      }
    }

    this.panel.nativeElement.style.transform = "rotateY(" + this.rotation.degrees + "deg)";

    if (this.finalAnimDirection === "left") {
      if (this.rotation.degrees <= this.finalAnimRotation) {
        clearInterval(this.endInterval);
        this.rotation.degrees = this.finalAnimRotation;
        this.managePanelDisplay();
        this.blockInteraction = false;
      }
    } else {
      if (this.rotation.degrees >= this.finalAnimRotation) {
        clearInterval(this.endInterval);
        this.rotation.degrees = this.finalAnimRotation;
        this.managePanelDisplay();
        this.blockInteraction = false;
      }
    }

  }

  managePanelDisplay() {

    // If new rotation goes too far in either direction, correct to zero or max
    if (this.rotation.degrees > 0) {
      this.rotation.degrees = 0;
    } else {
      if (this.rotation.degrees < this.maxRotation) {
        this.rotation.degrees = this.maxRotation;
      }
    }

    if (this.count !== Math.floor(this.rotation.degrees / -180)) {
      this.count = Math.floor(this.rotation.degrees / -180);
      // Turn off display of all pages
      for (let i = 0; i < this.nPages; i++) {
        this.panel.nativeElement.children[i].style.display = 'none';
      }
      // Display front facing panel
      this.panel.nativeElement.children[this.count].style.display = 'flex';
      // Display next probable front facing panel (the one we are turning to)
      if (this.count < this.nPages - 1) {
        this.panel.nativeElement.children[this.count + 1].style.display = 'flex';
      }
    }

    this.panel.nativeElement.style.transform = "rotateY(" + this.rotation.degrees + "deg)";

    // Update the pagecounter store array with the page number of the activePanel
    const payload = { panelNumber: Number(this.nPanel), pageNumber: this.count + 1 }
    this.store.dispatch(new UpdatePageCounter(payload));
  }

}