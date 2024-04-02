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

  counter: number = 0;

  constructor(private element: ElementRef, private store: Store) { }

  ngAfterViewInit() {

    this.nPages = this.element.nativeElement.children.length;
    this.maxRotation = (this.nPages - 1) * -180;

    for (let i = 2; i < this.nPages; i++) {
      this.element.nativeElement.children[i].style.display = 'none';
    }

    const payload = { panelNumber: Number(this.nPanel), totalPages: this.nPages }
    this.store.dispatch(new InitPageTotals(payload));

  }

  @HostListener('wheel', ['$event']) wheel(event: WheelEvent) {

    if (event.deltaY > 0) {
      this.rotation.degrees -= 20;
    } else {
      this.rotation.degrees += 20;
    }

    // if (this.rotation.degrees < this.maxRotation) this.rotation.degrees = this.maxRotation;

    this.managePanelDisplay();

    this.element.nativeElement.style.transform = "rotateY(" + this.rotation.degrees + "deg)";

  }

  @HostListener('touchstart', ['$event']) touchstart(event: TouchEvent) {

    this.lastX = this.touchStartX = event.changedTouches[0].clientX;
    this.touchStartTime = event.timeStamp;

  }

  @HostListener('touchmove', ['$event']) touchmove(event: TouchEvent) {

    const diffX = this.lastX - event.targetTouches[0].clientX;

    this.lastX = event.targetTouches[0].clientX;

    // If swiping right calculate new rotation if not yet minimum value (0)
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

    // // If new rotation goes too far in either direction, correct to zero or max
    // if (this.rotation.degrees > 0) {
    //   this.rotation.degrees = 0;
    // } else {
    //   if (this.rotation.degrees < this.maxRotation) {
    //     this.rotation.degrees = this.maxRotation;
    //   } else {
    //     console.log("this.count", this.count);
    //   }
    // }

    this.managePanelDisplay();

    this.element.nativeElement.style.transform = "rotateY(" + this.rotation.degrees + "deg)";

    const payload = { panelNumber: Number(this.nPanel), pageNumber: this.count + 1 }
    this.store.dispatch(new UpdatePageCounter(payload));

    

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

    let distanceX = this.touchEndX - this.touchStartX;
    let totalTime = this.touchEndTime - this.touchStartTime;

    let speed = distanceX / totalTime;

    this.finishFlipToCalculatedPage(speed, distanceX, totalTime);

  }

  managePanelDisplay() {

    // If new rotation goes too far in either direction, correct to zero or max
    if (this.rotation.degrees > 0) {
      this.rotation.degrees = 0;
    } else {
      if (this.rotation.degrees < this.maxRotation) {
        this.rotation.degrees = this.maxRotation;
      } else {
        console.log("this.count", this.count);
      }
    }

    if (this.count !== Math.floor(this.rotation.degrees / -180)) {
      this.count = Math.floor(this.rotation.degrees / -180);
      // Turn off display of all pages
      for (let i = 0; i < this.nPages; i++) {
        this.element.nativeElement.children[i].style.display = 'none';
      }
      // Display front facing panel
      this.element.nativeElement.children[this.count].style.display = 'flex';
      // Display next probable front facing panel (the one we are turning to)
      if (this.count < this.nPages - 1) {
        this.element.nativeElement.children[this.count + 1].style.display = 'flex';
      }
    }
  }

  finishFlipToCalculatedPage(speed: number, distanceX: number, totalTime: number) {

    this.finalAnimRotation = Math.round(this.rotation.degrees / 180) * 180;

    if (this.finalAnimRotation < this.rotation.degrees) {
      this.finalAnimDirection = "left";
    } else {
      if (this.finalAnimRotation > this.rotation.degrees) {
        this.finalAnimDirection = "right";
      }
    }

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

    this.element.nativeElement.style.transform = "rotateY(" + this.rotation.degrees + "deg)";

    if (this.finalAnimDirection === "left") {
      if (this.rotation.degrees <= this.finalAnimRotation) {
        this.rotation.degrees = this.finalAnimRotation;
        clearInterval(this.endInterval);
      }
    } else {
      if (this.rotation.degrees >= this.finalAnimRotation) {
        this.rotation.degrees = this.finalAnimRotation;
        clearInterval(this.endInterval);
      }
    }



  }

}
