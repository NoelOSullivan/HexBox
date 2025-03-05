import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Rotation } from '../interfaces/hexagon';
import { InitPageTotals, UpdatePageCounter } from '../../store/panel/panel.action';
import { DirectAccessModel, PageTurnerModel } from '../../store/panel/panel.model';
import { DirectAccess, PageTurner } from '../../store/panel/panel.state';
import { ActivePanelNumberModel } from '../../store/hexagon/hexagon.model';
import { ActivePanelNumber } from '../../store/hexagon/hexagon.state';
import { AppStateModel, IntroState } from 'app/store/general/general.model';
import { AppState } from 'app/store/general/general.state';

@Directive({
  selector: '[contentControl]',
  exportAs: 'ContentControl',
  standalone: true
})

export class ContentDirective implements OnInit {

  @Select(DirectAccess) directAccess$!: Observable<DirectAccessModel>;
  @Select(AppState) appState$!: Observable<AppStateModel>;

  @Input() nPanel!: string;
  @Output() changeActivePanel = new EventEmitter<number>();
  @Output() changePageNum = new EventEmitter<number>();
  @Output() setIsLastPage = new EventEmitter<boolean>();
  @Select(PageTurner) direction$!: Observable<PageTurnerModel>;
  @Select(ActivePanelNumber) activePanelNumber$!: Observable<ActivePanelNumberModel>;

  lastX!: number;
  rotation: Rotation = { degrees: 0 };
  directRotation!: number;
  nPages!: number;
  lastPage!: number | undefined;
  activePage: number = 0;
  maxRotation!: number;
  touchStartTime!: number;
  touchEndTime!: number;
  touchStartX!: number;
  touchEndX!: number;
  finalAnimInterval: any;
  directAccessInterval: any;
  onDirectAccess: boolean = false;
  finalAnimRotation!: number;
  direction!: String;
  finalAnimDirection!: String;
  blockWheelAndClick: boolean = true;
  activePanelNumber!: number;
  introState!: IntroState;
  isTouchOrMousedown: boolean = false;
  appState!: AppStateModel;
  firstClick: boolean = true;

  constructor(private panel: ElementRef, private store: Store) { }

  ngOnInit() {

    // Count the number of pages in the panel
    this.nPages = this.panel.nativeElement.children.length;
    this.maxRotation = (this.nPages - 1) * -180;

    // Only show first page
    for (let i = 1; i < this.nPages; i++) {
      this.panel.nativeElement.children[i].style.display = 'none';
    }

    // Update store with this panels total pages
    const payload = { panelNumber: Number(this.nPanel), totalPages: this.nPages }
    this.store.dispatch(new InitPageTotals(payload));

    this.direction$.subscribe(newDirection => {
      if (this.activePanelNumber === Number(this.nPanel)) {
        this.turnPage(newDirection.direction.direction);
      }
    });

    this.directAccess$.subscribe(newDA => {
      if (newDA.directAccess.nPage) {
        if (Number(this.nPanel) === newDA.directAccess.hexNum) {
          this.directAccess(newDA.directAccess.nPage - 1);
        }
      }
    });

    this.appState$.subscribe(newAppState => {
      this.introState = newAppState.introState;
      if (newAppState.introState === 'done') {
        this.blockWheelAndClick = false;
        this.panel.nativeElement.children[this.activePage].style.pointerEvents = 'all';
      }
    });

  }

  ngAfterViewInit() {
    this.activePanelNumber$.subscribe(newAPN => {
      this.activePanelNumber = newAPN.activePanelNumber.apn
      if (this.activePanelNumber === 0) this.activePanelNumber = 6;
      this.changeActivePanel.emit(this.activePanelNumber);
      this.lastPage = undefined;
    });

  }

  @HostListener('wheel', ['$event']) wheel(event: WheelEvent) {
    if (!this.blockWheelAndClick) {
      if (Number(this.nPanel) === this.activePanelNumber) {
        if (event.deltaY > 0) {
          if (this.activePage < this.nPages - 1) {
            this.turnPage("left");
          }
        } else {
          if (this.activePage > 0) {
            this.turnPage("right");
          }
        }
      }
    }
  }

  @HostListener('touchstart', ['$event']) touchstart(event: TouchEvent) {
    if (!this.blockWheelAndClick) {
      if (Number(this.nPanel) === this.activePanelNumber) {
        this.isTouchOrMousedown = true;
        this.manageDown(event.changedTouches[0].clientX);
      }
    }
  }

  @HostListener('touchmove', ['$event']) touchmove(event: TouchEvent) {
    if (!this.blockWheelAndClick) {
      event.preventDefault();
      if (Number(this.nPanel) === this.activePanelNumber) {
        this.manageMove(event.targetTouches[0].clientX);
      }
    }
  }

  @HostListener('touchend', ['$event']) touchend(event: TouchEvent) {
    if (!this.blockWheelAndClick) {
      if (Number(this.nPanel) === this.activePanelNumber) {
        this.manageUp(event.changedTouches[0].clientX);
      }
    }
  }

  manageDown(posX: number): void {
    this.lastX = this.touchStartX = posX;
    this.firstClick = true;
  }

  manageMove(posX: number): void {
    if (this.isTouchOrMousedown) {

      // Detect movement of finger since last event
      const diffX = this.lastX - posX;
      this.lastX = posX;
      // If swiping right calculate new rotation if not yet minimum value (0)
      // TO DO : 3 is arbitary. Maybe find a rule.
      if (diffX < 0) {
        this.direction = "right"
        if (this.rotation.degrees < 0) {
          this.rotation.degrees -= diffX * 3;
        }
      } else {
        // If swiping left calculate new rotation if not yet maximum value (this.maxRotation)
        if (diffX > 0) {
          this.direction = "left"
          if (this.rotation.degrees > this.maxRotation) {
            this.rotation.degrees -= diffX * 3;
          }
        }
      }
      this.managePanelDisplay(false);
    }

  }

  manageUp(posX: number): void {
    this.isTouchOrMousedown = false;
    this.touchEndX = posX;
    if (this.touchEndX < this.touchStartX) {
      this.direction = "left"
      // Calculate the final degrees that will be flipped to
      this.finalAnimRotation = Math.round(this.rotation.degrees / 180) * 180;
      this.finishFlipToCalculatedPage();
    } else {
      if (this.touchEndX > this.touchStartX) {
        this.direction = "right"
        // Calculate the final degrees that will be flipped to
        this.finalAnimRotation = Math.round(this.rotation.degrees / 180) * 180;
        this.finishFlipToCalculatedPage();
      }
    }
  }

  directAccess(page: number) {
    this.directRotation = (page) * -180;
    const diff = page - this.activePage;
    this.directAccessInterval = setInterval(() => {
      this.rotation.degrees -= diff;
      if (diff > 0) {
        if (this.rotation.degrees <= this.directRotation) {
          this.onDirectAccess = true;
          this.rotation.degrees = this.directRotation
          clearInterval(this.directAccessInterval);
          this.changePageNum.emit(this.activePage + 1);
        }
      } else {
        if (this.rotation.degrees >= this.directRotation) {
          this.onDirectAccess = true;
          this.rotation.degrees = this.directRotation
          clearInterval(this.directAccessInterval);
          this.changePageNum.emit(this.activePage - 1);
        }
      }
      this.managePanelDisplay(false);
    }, 0);
  }

  turnPage(direction: string) {
    if (direction === "left") {
      if (this.rotation.degrees >= this.maxRotation) {
        this.blockWheelAndClick = true;
        this.direction = "left"
        this.finalAnimRotation = this.rotation.degrees - 180;
        this.finishFlipToCalculatedPage();
      }
    } else {
      if (this.rotation.degrees <= 0) {
        this.blockWheelAndClick = true;
        this.direction = "right"
        this.finalAnimRotation = this.rotation.degrees + 180;
        this.finishFlipToCalculatedPage();
      }
    }
  }

  finishFlipToCalculatedPage() {
    let allowFinishFlip = false;
    if (this.finalAnimRotation < this.rotation.degrees) {
      allowFinishFlip = true;
      this.finalAnimDirection = "left";
    } else {
      if (this.finalAnimRotation > this.rotation.degrees) {
        allowFinishFlip = true;
        this.finalAnimDirection = "right";
      } else {
        // For when the user releases the flipper and no animation is needed
        this.finishFlip();
      }
    }
    // TODO : try to avoid this interval
    if (allowFinishFlip) {
      this.finalAnimInterval = setInterval(() => {
        this.finishFlip();
      }, 5);
    }

  }

  finishFlip() {
    if (this.finalAnimDirection === "left") {
      this.rotation.degrees -= 5;
    } else {
      if (this.finalAnimDirection === "right") {
        this.rotation.degrees += 5;
      }
    }

    let flipFinished = false;

    if (this.finalAnimDirection) {
      if (this.finalAnimDirection === "left") {
        if (this.rotation.degrees <= this.finalAnimRotation) {
          clearInterval(this.finalAnimInterval);
          this.rotation.degrees = this.finalAnimRotation;
          if (this.introState === 'done') {
            this.blockWheelAndClick = false;
          }
          if (this.activePage + 1 < this.nPages) {
            flipFinished = true;
            // this.changePageNum.emit(this.activePage + 1);
          }
        }
      } else {
        if (this.rotation.degrees >= this.finalAnimRotation) {
          clearInterval(this.finalAnimInterval);
          this.rotation.degrees = this.finalAnimRotation;
          if (this.introState === 'done') {
            this.blockWheelAndClick = false;
          }
          flipFinished = true;
          // this.changePageNum.emit(this.activePage);
        }
      }
    } else {
      this.changePageNum.emit(this.activePage);
    }

    this.managePanelDisplay(flipFinished);

    this.panel.nativeElement.style.transform = "rotateY(" + this.rotation.degrees + "deg)";
  }

  managePanelDisplay(flipFinished: boolean) {

    // If new rotation goes too far in either direction, correct to zero or max 
    if (this.rotation.degrees > 0) {
      this.rotation.degrees = 0;
    } else {
      if (this.rotation.degrees < this.maxRotation) {
        this.rotation.degrees = this.maxRotation;
      }
    }

    // if (this.activePage !== Math.floor(this.rotation.degrees / -180) || this.firstClick) {
    if (this.activePage !== -Math.round(-this.rotation.degrees / -180) || this.firstClick || flipFinished) {
      this.firstClick = false;
      // this.activePage = Math.floor(this.rotation.degrees / -180);
      this.activePage = -Math.round(-this.rotation.degrees / -180);

      this.changePageNum.emit(this.activePage);
      this.setIsLastPage.emit(this.activePage===this.nPages-1);

      // Turn off display of all pages
      this.turnOffAllPages();
      // Display front facing panel
      this.panel.nativeElement.children[this.activePage].style.display = 'flex';
      this.panel.nativeElement.children[this.activePage].style.pointerEvents = 'all';
      // Display next probable front facing panel (the one we are turning to)
      if (!flipFinished && this.onDirectAccess === false) {
        if (this.direction === 'left') {
          if (this.activePage < this.nPages - 1) {
            this.panel.nativeElement.children[this.activePage + 1].style.display = 'flex';
          }
        } else {
          if (this.direction === 'right') {
            if (this.activePage > 0) {
              this.panel.nativeElement.children[this.activePage - 1].style.display = 'flex';
            }
          }
        }
      }
      this.onDirectAccess = false;
    }

    this.panel.nativeElement.style.transform = "rotateY(" + this.rotation.degrees + "deg)";

    // This patch forces the page number to 2 if the rotation is in first half turn
    // This patch forces the page number to nPages if the rotation is in last half turn
    // This ensures that the arrows update at the halfway point of the first and last flip
    let nPage = this.activePage + 1;
    if (this.rotation.degrees < -90 && this.rotation.degrees > -180) {
      nPage = 2;
    } else {
      if (this.rotation.degrees < this.maxRotation + 90) {
        nPage = this.nPages;
      } else {
        nPage = this.activePage + 1;
      }
    }

    if (this.lastPage !== nPage) {
      this.lastPage = nPage;
      // Update the pagecounter store array with the page number of the activePanel
      const payload = { panelNumber: Number(this.nPanel), pageNumber: nPage }
      this.store.dispatch(new UpdatePageCounter(payload));
    }
  }

  turnOffAllPages(): void {
    for (let i = 0; i < this.nPages; i++) {
      this.panel.nativeElement.children[i].style.display = 'none';
      this.panel.nativeElement.children[i].style.pointerEvents = 'none';
    }
  }

}