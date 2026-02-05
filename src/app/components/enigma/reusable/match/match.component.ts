import { Component, effect, ElementRef, input, Input, output, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { ElementData, Point } from '../../../../shared/types';
import { SingletonService } from '../../../../shared/utils';
import { ZoomDetailComponent } from "./zoom-detail/zoom-detail.component";

@Component({
  selector: 'app-match',
  imports: [NgClass, ZoomDetailComponent],
  providers: [SingletonService],
  templateUrl: './match.component.html',
  styleUrl: './match.component.scss'
})

export class MatchComponent {

  constructor(private singletonService: SingletonService) {
    effect(() => {
      if(this.enigmaEndInfo() === true) {
        this.overAndDone = true;
        this.timeOutFlameDeath && clearTimeout(this.timeOutFlameDeath);
      }
    });

  }

  @Input() appWidth!: number;
  @Input() appHeight!: number;
  @Input() passedElementData!: ElementData[] | undefined;
  // @Input() passedScrollData!: DOMRect | undefined;
  // @Input() enigmaEnd!: boolean;

  enigmaEndInfo = input.required<boolean>();

  public matchLit = output<boolean>();
  public moveFigure = output<boolean>();
  public burntStates = output<boolean[]>();
  public scrollFallen = output<boolean>();
  public wallsOpen = output<boolean>();
  private myBurntStates: boolean[] = [false, false, false, false]
  private figureDone: boolean = false;
  public elementOnFire: boolean = false;
  public elementsDone: boolean = false;
  public overAndDone: boolean = false;

  emitMatchLit(event: boolean) {
    this.matchLit.emit(event);
  }

  emitMoveFigure(event: boolean) {
    this.moveFigure.emit(event);
  }

  emitBurntStates(event: boolean[]) {
    this.burntStates.emit(event);
  }

  emitScrollFallen(event: boolean) {
    this.scrollFallen.emit(event);
  }

  emitWallsOpen(event: boolean) {
    this.wallsOpen.emit(event);
  }



  readonly matchHolder = viewChild.required<ElementRef>('matchHolder');
  readonly mask = viewChild.required<ElementRef>('mask');
  readonly flame = viewChild.required<ElementRef>('flame');
  readonly flame2 = viewChild.required<ElementRef>('flame2');
  readonly candle = viewChild.required<ElementRef>('candle');

  maskWidth!: number;
  maskHeight!: number;
  matchHolderWidth!: number;
  matchHolderHeight!: number;
  maskClicked: boolean = false;
  myMatchLit: boolean = false;
  haloLit: boolean = false;
  cursorPos: Point = undefined;

  timeOutMatchMove!: any;
  // intervalMatchStill!: any;
  timeOutFlameDeath!: any;

  startTime!: number;
  totalTime: number = 20;

  maskMoving: boolean = false;
  candleLit: boolean = false;
  candleActive: boolean = false;

  appCentre!: Point;
  elementData!: Array<ElementData>;
  scrollData!: DOMRect;
  zoomImage!: string | undefined;
  zoomPercentX!: number;
  zoomPercentY!: number;
  zoomVisible: boolean = false;
  percentLeft!: number;
  percentTop!: number;
  doneElements: boolean[] = [false, false, false, false];
  targetPercentagePoints: Point[] = [{ x: 13, y: 53 }, { x: 9, y: 46 }, { x: 37, y: 64 }, { x: 95, y: 22 }];

  doneEarth: boolean = false;
  doneWind: boolean = false;
  doneFire: boolean = false;
  doneWater: boolean = false;
  myScrollFallen: boolean = false;
  myScrollOpen: boolean = false;

  ngOnChanges(changes: any): void {
    if (changes.appWidth) {
      this.appCentre = { x: changes.appWidth.currentValue / 2, y: changes.appHeight.currentValue / 2 };
    }

    if (changes.passedElementData) {
      this.elementData = changes.passedElementData.currentValue;
    }

    // if (changes.passedScrollData) {
    //   this.scrollData = changes.passedScrollData.currentValue;
    // }
  }

  ngAfterViewInit() {
    this.maskWidth = (this.mask().nativeElement.getBoundingClientRect().right - this.mask().nativeElement.getBoundingClientRect().left) / 2;
    this.maskHeight = (this.mask().nativeElement.getBoundingClientRect().bottom - this.mask().nativeElement.getBoundingClientRect().top) / 2;
    this.matchHolderWidth = (this.matchHolder().nativeElement.getBoundingClientRect().right - this.matchHolder().nativeElement.getBoundingClientRect().left) / 2;
    this.matchHolderHeight = (this.matchHolder().nativeElement.getBoundingClientRect().bottom - this.matchHolder().nativeElement.getBoundingClientRect().top) / 2;
  }

  touchstartMask(event: TouchEvent): void {
    event.preventDefault();
    let posX = event.touches[0].clientX;
    let posY = event.touches[0].clientY;
    this.manageDown(posX, posY);
  }

  mousedownMask(event: MouseEvent): void {
    let posX = event.clientX;
    let posY = event.clientY;
    this.manageDown(posX, posY);
  }

  manageDown(posX: number, posY: number) {
    if (this.overAndDone) return;
    let rect;
    if (!this.candleLit) {
      rect = this.matchHolder().nativeElement.getBoundingClientRect();
    } else {
      rect = this.candle().nativeElement.getBoundingClientRect();
    }
    if ((posX >= rect.left - 10) && (posX <= rect.right + 10)) {
      if ((posY >= rect.top - 10) && (posY <= rect.bottom + 10)) {
        this.cursorPos = { x: posX, y: posY }
        this.maskClicked = true;

        if (!this.candleLit) {
          this.placeMatch();
          this.emitMatchLit(true);
        } else {
          this.placeCandle();
          if (!this.myScrollFallen) {
            this.myScrollFallen = true;
            this.emitScrollFallen(this.myScrollFallen);
          }
        }

        if (!this.myMatchLit) {
          this.startTime = performance.now();

          if (!this.candleLit) {
            this.flame().nativeElement.style.transition = "scale 0.6s ease-out, rotate 0.5s ease-out, top 23s ease-out";

            requestAnimationFrame(() => {
              this.flame().nativeElement.style.top = '-90px';
              this.myMatchLit = true;
              this.haloLit = true;
              this.placeMask();
            });
          }

          setTimeout(() => {
            // this.intervalMatchStill = setInterval(() => {
            //   console.log("PLACING MATCH STILL");
            //   this.placeMask();
            // }, 100);

            if (!this.candleLit) {
              this.candle().nativeElement.style.zIndex = 2;
              this.flame().nativeElement.style.scale = '0.4 0.15';
              this.timeOutFlameDeath = setTimeout(() => {
                this.flame().nativeElement.style.scale = '0 0';
                this.haloLit = false;
                this.maskClicked = false;
                setTimeout(() => {
                  this.myMatchLit = false;
                  this.matchHolder().nativeElement.style.left = 'calc(50% + 110px)';
                  this.matchHolder().nativeElement.style.top = '70%';
                  this.flame().nativeElement.style.transition = "scale 0s, rotate 0.5s ease-out, top 0s";
                  // clearInterval(this.intervalMatchStill);
                  setTimeout(() => {
                    this.flame().nativeElement.style.top = '-140px';
                    this.flame().nativeElement.style.left = '-30%';
                    this.flame().nativeElement.style.scale = "1.2 0";
                    this.mask().nativeElement.style.left = 'calc(-50% + 20px)';
                    this.mask().nativeElement.style.top = 'calc(-50% + 150px)';
                  }, 0);
                }, 1000);
              }, 20000);
            }
          }, 0);
        }
      }
    }
  }

  touchmoveMask(event: TouchEvent): void {
    event.preventDefault();
    if (this.maskClicked === true) {
      let actualX = event.touches[0].clientX;
      let actualY = event.touches[0].clientY;
      this.manageMove(actualX, actualY);
    }
  }

  mousemoveMask(event: MouseEvent): void {
    if (this.maskClicked === true) {
      let actualX = event.clientX;
      let actualY = event.clientY;
      this.manageMove(actualX, actualY);
    }
  }

  manageMove(actualX: number, actualY: number): void {
    if (this.overAndDone) return;
    this.maskMoving = true;

    // Make the flame jiggle when moving match
    if (actualX > this.cursorPos!.x) {
      if (!this.candleLit) {
        this.flame().nativeElement.style.rotate = '-20deg';
        this.flame().nativeElement.style.scale = '0.4 0.2'
      } else {
        this.flame2().nativeElement.style.rotate = '-45deg';
        this.flame2().nativeElement.style.scale = '0.4 0.35'
      }
    } else {
      if (actualX < this.cursorPos!.x) {
        if (!this.candleLit) {
          this.flame().nativeElement.style.rotate = '110deg';
          this.flame().nativeElement.style.scale = '0.4 0.2'
        } else {
          this.flame2().nativeElement.style.rotate = '45deg';
          this.flame2().nativeElement.style.scale = '0.4 0.35'
        }
      }
    }

    // Detects when cursor stops moving
    this.timeOutMatchMove = setTimeout(() => {
      clearTimeout(this.timeOutMatchMove);
      this.straightFlame();
    }, 200);

    this.cursorPos = { x: actualX, y: actualY }

    if (!this.candleLit) {
      this.placeMatch();
    } else {
      this.placeCandle();
    }
    this.placeMask();

  }

  straightFlame() {

    if (this.overAndDone) return;
    if (!this.candleLit) {
      this.flame().nativeElement.style.rotate = '45deg';
      this.flame().nativeElement.style.scale = '0.4 0.15'
    } else {
      this.flame2().nativeElement.style.rotate = '0deg';
      this.flame2().nativeElement.style.scale = '0.5 0.3'
    }
    this.maskMoving = false;
  }

  touchendMask(): void {
    this.maskClicked = false;
    this.maskMoving = false;
    // clearInterval(this.intervalMatchStill);
  }

  mouseupMask(): void {
    this.maskClicked = false;
    this.maskMoving = false;
    // clearInterval(this.intervalMatchStill);
  }

  placeMatch() {
    this.matchHolder().nativeElement.style.left = this.cursorPos!.x - 10 + "px";
    this.matchHolder().nativeElement.style.top = this.cursorPos!.y - (this.matchHolderHeight * 2) - 20 + "px";
    // Detect match flame nearing hidden figure
    if (!this.figureDone) {
      if (this.appCentre) {
        if (Math.abs(this.appCentre.x - this.cursorPos!.x) < 80) {
          if (Math.abs(this.appCentre.y - this.cursorPos!.y) < 80) {
            this.figureDone = true;
            this.emitMoveFigure(true);
            setTimeout(() => {
              this.candleActive = true;
            }, 1200);
          }
        }
      }
    }

    // Detect match flame touching unlit candle flame
    if (this.candleActive) {
      if (Math.abs(this.flame().nativeElement.getBoundingClientRect().x - this.flame2().nativeElement.getBoundingClientRect().x) < 10) {
        if (Math.abs(this.flame().nativeElement.getBoundingClientRect().y - this.flame2().nativeElement.getBoundingClientRect().y) < 30) {
          clearTimeout(this.timeOutFlameDeath);
          this.flame2().nativeElement.style.scale = '0.5 0.3';
          this.maskClicked = false;
          this.maskMoving = false;
          this.myMatchLit = false;
          this.candleLit = true;
          this.flame().nativeElement.style.scale = '0.5 0';
          this.matchHolder().nativeElement.style.transition = "top 0.7s ease-in";
          setTimeout(() => {
            this.matchHolder().nativeElement.style.top = '110%';
          }, 0);
        }
      }
    }

  }

  placeCandle() {

    let lightPos: Point = { x: this.cursorPos!.x + 1, y: this.cursorPos!.y - 100 };
    this.candle().nativeElement.style.left = this.cursorPos!.x - 20 + "px";
    this.candle().nativeElement.style.top = this.cursorPos!.y - 50 + "px";

    if (this.elementData) {
      let foundTarget = false;
      for (let i = 0, length = this.elementData.length; i < length; i++) {

        let pointIsInsideRect = this.singletonService.isPointInsideDOMRect(this.elementData[i]!.boundingRect, lightPos);
        if (pointIsInsideRect === true) {
          foundTarget = true;
          this.zoomImage = this.elementData[i]?.element + ".png";
          this.zoomVisible = true;

          let distFromLeft = lightPos.x - this.elementData[i]!.boundingRect.left;
          this.percentLeft = Math.round(distFromLeft / this.elementData[i]!.boundingRect.width * 100);

          let distFromTop = lightPos.y - this.elementData[i]!.boundingRect.top;// - 10;
          this.percentTop = Math.round(distFromTop / this.elementData[i]!.boundingRect.height * 100);
          // if (this.percentTop > 70) this.percentTop = 70;

          this.elementOnFire = false;
          if (this.doneElements[i]) {
            this.elementOnFire = true;
          } else {
            if (this.isTouchingTarget(this.targetPercentagePoints[i]!.x, this.targetPercentagePoints[i]!.y)) {
              this.myBurntStates[i] = true;
              this.burntStates.emit(this.myBurntStates);
              this.elementOnFire = true;
              this.doneElements[i] = true;
              if (!this.doneElements.includes(false)) {
                this.elementsDone = true;
                this.candleActive = false;
                this.emitWallsOpen(true);
                // console.log("CLEARING INTERVAL");
                // clearInterval(this.intervalMatchStill);
                setTimeout(() => {
                  this.overAndDone = true;
                }, 500);
              }
            }
          }
        }
      }

      if (foundTarget === false) {
        this.zoomVisible = false;
        this.elementOnFire = false;
      }
    }

  }

  isTouchingTarget(targetPercentLeft: number, targetPercentTop: number): boolean {
    if (Math.abs(this.percentLeft - targetPercentLeft) <= 2) {
      if (Math.abs(this.percentTop - targetPercentTop) <= 2) {
        return true;
      }
      return false;
    }
    return false;
  }

  placeMask() {
    if (this.overAndDone) return;
    let currentTime = performance.now();

    // Diff is used for mask flicker
    let diffRange = (this.maskMoving === true) ? 10 : 4;
    let diff = (Math.floor(Math.random() * diffRange));

    if (!this.candleLit) {
      // mask follows flame thanks to xyFlameCorrection
      let timeFromStart = Math.round((currentTime - this.startTime) / 1000);
      let percentageTimeFromStart = timeFromStart / this.totalTime * 100;
      let xyFlameCorrection = 40 / 100 * percentageTimeFromStart;
      this.mask().nativeElement.style.left = this.cursorPos!.x - (this.maskWidth) - 30 + diff + xyFlameCorrection + "px";
      this.mask().nativeElement.style.top = this.cursorPos!.y - (this.maskHeight) - (this.matchHolderHeight * 2) - 20 + diff + xyFlameCorrection + "px";
    } else {
      this.mask().nativeElement.style.left = this.cursorPos!.x - (this.maskWidth) + diff + "px";
      this.mask().nativeElement.style.top = this.cursorPos!.y - (this.maskHeight) - 120 + diff + "px";
    }
  }

}
