import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { Rotation } from '../interfaces/hexagon';
import { InitPageTotals, UpdatePageCounter } from '../../store/panel/panel.action';
import { Observable } from 'rxjs';
import { PageTurnerModel } from '../../store/panel/panel.model';
import { PageTurner } from '../../store/panel/panel.state';
import { ActivePanelNumberModel } from '../../store/hexagon/hexagon.model';
import { ActivePanelNumber } from '../../store/hexagon/hexagon.state';

@Directive({
  selector: '[flipControl]',
  exportAs: 'FlipControl',
  standalone: true
})

export class ContentDirective implements OnInit {

  @Input() nPanel!: string;
  @Select(PageTurner) direction$!: Observable<PageTurnerModel>;
  @Select(ActivePanelNumber) activePanelNumber$!: Observable<ActivePanelNumberModel>;

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
  direction!: String;
  finalAnimDirection!: String;
  blockWheelAndClick: boolean = false;
  activePanelNumber!: number;

  counter: number = 0;

  constructor(private panel: ElementRef, private store: Store) { }

  ngOnInit() {

    this.activePanelNumber$.subscribe(newAPN => {
      this.activePanelNumber = newAPN.activePanelNumber.apn
    });

    this.direction$.subscribe(newDirection => {
      if (!this.blockWheelAndClick) {
        if(this.activePanelNumber === 0) this.activePanelNumber = 6;
        if(this.activePanelNumber === Number(this.nPanel)) {
          this.turnPage(newDirection.direction.direction);
        }
      }
    });

  }

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
    if (!this.blockWheelAndClick) {
      // if(Number(this.nPanel) === this.activePanelNumber) {
        if (event.deltaY > 0) {
          this.turnPage("left");
        } else {
          this.turnPage("right");
        }
      // }
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
      this.direction = "left"
    } else {
      if (this.touchEndX > this.touchStartX) {
        this.direction = "right"
      }
    }

    // Calculate the final degrees that will be flipped to
    this.finalAnimRotation = Math.round(this.rotation.degrees / 180) * 180;
    this.finishFlipToCalculatedPage();
  }

  turnPage(direction: string) {
    if (direction === "left") {
      if (this.rotation.degrees > this.maxRotation) {
        this.blockWheelAndClick = true;
        this.direction = "left"
        this.finalAnimRotation = this.rotation.degrees - 180;
        this.finishFlipToCalculatedPage();
      }
    } else {
      if (this.rotation.degrees < 0) {
        this.blockWheelAndClick = true;
        this.direction = "right"
        this.finalAnimRotation = this.rotation.degrees + 180;
        this.finishFlipToCalculatedPage();
      }
    }
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

    this.managePanelDisplay();

    if (this.finalAnimDirection === "left") {
      if (this.rotation.degrees <= this.finalAnimRotation) {
        clearInterval(this.endInterval);
        this.rotation.degrees = this.finalAnimRotation;
        this.blockWheelAndClick = false;
      }
    } else {
      if (this.rotation.degrees >= this.finalAnimRotation) {
        clearInterval(this.endInterval);
        this.rotation.degrees = this.finalAnimRotation;
        this.blockWheelAndClick = false;
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
      // console.log("count", this.count);
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

    // This patch forces the page number to 2 if the rotation is in first half turn
    // This patch forces the page number to nPages if the rotation is in last half turn
    // This ensures that the arrows update at the halfway point of the first and last flip
    let nPage = this.count + 1;
    if (this.rotation.degrees < -90 && this.rotation.degrees > -180) {
      nPage = 2;
    } else {
      if (this.rotation.degrees < this.maxRotation + 90) {
        nPage = this.nPages;
      } else {
        nPage = this.count + 1;
      }
    }

    // Update the pagecounter store array with the page number of the activePanel
    const payload = { panelNumber: Number(this.nPanel), pageNumber: nPage }
    this.store.dispatch(new UpdatePageCounter(payload));
  }

}