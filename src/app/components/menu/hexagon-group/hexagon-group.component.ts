import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, viewChild, effect, viewChildren } from '@angular/core';
import { Router, Event as NavigationEvent } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Location, NgClass, NgIf } from '@angular/common';
import { DataService } from '../../../shared/services/data.service';
import { HexagonComponent } from '../hexagon/hexagon.component';
import { Rotation, ActivePanelNumber, HexBoxInterface } from '../../../shared/interfaces/hexagon';
import { ChangePanelNumber, ChangeRotation, ChangeHexBox } from '../../../store/hexagon/hexagon.actions';
import { HexBox } from 'app/store/hexagon/hexagon.state';
import { DirectAccess, PageCounters } from '../../../store/panel/panel.state';
import { Observable } from 'rxjs';
import { DirectAccessModel, PageCounterModel } from '../../../store/panel/panel.model';
import { AppStateModel, IntroState, LanguageModel, SunGameState } from 'app/store/general/general.model';
import { AppState, Language } from 'app/store/general/general.state';
import { BackButtonClick, ChangeBlockAllState, ChangeEggState, ChangeIntroState, RobotAirbusAnim, TransmitEggInfo } from 'app/store/general/general.actions';
import { LangButtonComponent } from '../lang-button/lang-button.component';
import { VolumeButtonComponent } from '../volume-button/volume-button.component';
import { SwipeIconComponent } from 'app/shared/components/swipe-icon/swipe-icon.component';
import { EggComponent } from 'app/shared/components/egg/egg.component';
import { TarantulaComponent } from 'app/shared/components/tarantula/tarantula.component';
import { CircularTextComponent } from 'app/shared/components/circular-text/circular-text.component';
import { AccessPanelDirect, UpdatePageCounter } from 'app/store/panel/panel.action';
import { DomRect, EggInfo } from 'app/shared/interfaces/general';
import { HexBoxModel } from 'app/store/hexagon/hexagon.model';
import { Howl, Howler } from 'howler';

@Component({
  selector: 'hexagon-group',
  standalone: true,
  imports: [NgClass, NgIf, HexagonComponent, LangButtonComponent, VolumeButtonComponent, SwipeIconComponent, EggComponent, TarantulaComponent, CircularTextComponent],
  providers: [DataService],
  templateUrl: './hexagon-group.component.html',
  styleUrls: ['./hexagon-group.component.scss']
})

export class HexagonGroupComponent implements OnInit, AfterViewInit {

  @Select(DirectAccess) directAccess$!: Observable<DirectAccessModel>;
  @Select(AppState) appState$!: Observable<AppStateModel>;
  @Select(HexBox) hexbox$!: Observable<HexBoxModel>;
  @Select(Language) language$!: Observable<LanguageModel>;
  @Select(PageCounters) pageCounters$!: Observable<PageCounterModel>;
  // @Select(ActivePanelNumber) activePanelNumber$!: Observable<ActivePanelNumberModel>;

  @ViewChild('menuRotate') menuRotate!: ElementRef;
  @ViewChild('catapult') catapult!: ElementRef;
  @ViewChild('egg') egg!: ElementRef;
  @ViewChild('eggSight') eggSight!: ElementRef;
  @ViewChild('eggShadow') eggShadow!: ElementRef;
  @ViewChild('slingLeft') slingLeft!: ElementRef;
  @ViewChild('slingRight') slingRight!: ElementRef;
  @ViewChild('slingAnchor') slingAnchor!: ElementRef;
  @ViewChild('leftElastic') leftElastic!: ElementRef;
  @ViewChild('rightElastic') rightElastic!: ElementRef;
  @ViewChild('slingButton') slingButton!: ElementRef;
  @ViewChild('tarantulaHolder') tarantulaHolder!: ElementRef;
  @ViewChild('domeTarantulaHolder') domeTarantulaHolder!: ElementRef;
  @ViewChild('otherStuff') otherStuff!: ElementRef;

  appState!: AppStateModel;
  hexbox!: HexBoxModel;
  introState!: IntroState;
  sunGameState!: SunGameState;
  sunGameTargets: Array<DomRect> = [];
  allowCatapult: boolean = true;

  showBackButton: boolean = false;
  allowBackButton: boolean = false;

  startPoint: { x: number, y: number } = { x: 0, y: 0 };
  movePoint: { x: number, y: number } = { x: 0, y: 0 };

  turnDirection = "anti-clockwise";
  // endPoint: { x: number, y: number } = { x: 0, y: 0 };
  // vector: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private dataService: DataService, private router: Router, private store: Store) { }

  public menuContent: Array<any> = [];
  public menuContentLanguage: Array<any> = [];
  public menuContent2: string = "Click Me";
  public hexOpened: Array<any> = [];
  public selected!: number;
  public rolled: number | null = null;
  public tarantulaIsOut: boolean = false;
  public tarantulaIsMoving: boolean = true;
  public daTarantulaIsOut: boolean = false;
  public daTarantulaIsMoving: boolean = true;
  public daTarantulaIsForward: boolean = false;
  public daActivated: boolean = false;
  public directAccessOpen: boolean = false;
  public toolsOpen: boolean = false;
  public toolsActivated: boolean = false;
  public toolsAreOut: boolean = false;
  public toolsAreMoving: boolean = false;

  private allMenus!: any;
  private lastSelected!: number;
  private menuRotation: number = 0;
  private hexagons: Array<any> = [];
  private hexagonFlips: Array<any> = [];
  private introDone: boolean = false;
  private blockAll: boolean = false;
  private language!: string;
  private pageCounters!: PageCounterModel;
  private contentHeight: number = 0;
  private slingWasPressed: boolean = false;

  private myDegreesArray = [-60, 0, 60, 120, 180, -120];

  private introVideoLoaded: boolean = false;
  public daTextContent!: string;
  public toolsTextContent!: string;

  private spiderFeetSound!: any;
  private hToolsSound!: any;
  private hexSound!: any;
  private catapultSound!: any;
  private eggFlightSound!: any;
  private eggSmashSound!: any;
  private volume: number = 0;

  ngOnInit() {

    this.hToolsSound = new Howl({ src: ['assets/audio/cogOK.mp3'], volume: this.volume, html5: true, autoplay: false, onend: () => { this.hToolsSound.unload(); } });
    this.spiderFeetSound = new Howl({ src: ['assets/audio/spiderFeet.mp3'], volume: this.volume, html5: true, autoplay: false, loop: true, onend: () => { this.spiderFeetSound.unload(); } });
    this.hexSound = new Howl({ src: ['assets/audio/hex.mp3'], volume: this.volume, html5: true, autoplay: false, onend: () => { this.hToolsSound.unload(); } });
    this.catapultSound = new Howl({ src: ['assets/audio/catapult.mp3'], volume: this.volume, html5: true, autoplay: false, onend: () => { this.catapultSound.unload(); } });
    this.eggFlightSound = new Howl({ src: ['assets/audio/eggFlight.mp3'], volume: this.volume, html5: true, autoplay: false, onend: () => { this.eggFlightSound.unload(); } });
    this.eggSmashSound = new Howl({ src: ['assets/audio/eggSmash.mp3'], volume: this.volume, html5: true, autoplay: false, onend: () => { this.eggSmashSound.unload(); } });

    // this.hToolsSound.volume(0.2);

    // this.toolsSound = new Audio();

    // this.toolsSound = new Audio();
    // this.toolsSound.src = "assets/audio/tools.mp3";
    // this.toolsSound.preload = 'auto';
    // this.toolsSound.load();
    // this.toolsSound.volume = 0;
    // this.toolsSound.play();

    // this.toolsSound = new Audio("assets/audio/toolsSound.mp3");

    this.lastSelected = 0;

    this.getMenus();

    this.hexOpened = [false, false, false, false, false, false];

    // setTimeout(() => {
    //   for (let i = 0; i < 6; i++) {
    //     this.introHexagonWithDelay(i);
    //   }
    // }, 1000);


    // Calls change of menu after menu intro
    // setTimeout(() => {
    //   this.changeMenu();
    // }, 5000);

    // To do : check for use of this and erase
    // this.directAccess$.subscribe(newDA => {
    //   if (newDA.directAccess.hexNum) {
    //     console.log("YEEHAW");
    //     // this.manageMenu(newDA.directAccess.hexNum + 1);
    //   }
    // });

    this.hexbox$.subscribe(newHexBox => {
      this.hexbox = newHexBox;
    });

    this.appState$.subscribe(newAppState => {

      if (newAppState.introVideoLoaded !== this.introVideoLoaded) {
        this.introVideoLoaded = newAppState.introVideoLoaded;
        this.startHexagonIntroAnim();
      }

      // To Do : this gets called every time for the mouseupoutside on wheel menus
      // It keeps being called. No good.
      this.introState = newAppState.introState;
      if (this.introState === 'onFinalAnim' && this.introDone === false) {
        this.introDone = true;
        this.menuLanguageChange();
        this.manageMenu(2);
        this.activateDirectAccess();
        this.activateTools();
      }
      if (this.sunGameState !== newAppState.sunGameState) {
        this.sunGameState = newAppState.sunGameState;
        switch (this.sunGameState) {
          case SunGameState.GAMEOFF:
          case SunGameState.GAMEOVER:
            if (this.catapult) {
              this.catapult.nativeElement.style.transition = "opacity 0.75s ease-out";
              setTimeout(() => {
                this.catapult.nativeElement.style.opacity = 0;
              }, 0);
              this.catapult.nativeElement.style.pointerEvents = 'none';
            }
            break;
          case SunGameState.GAMEON:
            this.catapult.nativeElement.style.transition = "opacity 1.25s ease-in";
            setTimeout(() => {
              this.catapult.nativeElement.style.opacity = 100;
            }, 0);
            this.catapult.nativeElement.style.pointerEvents = 'all';
            break;
        }
      }
      if (newAppState.contentHeight !== this.contentHeight) {
        this.contentHeight = newAppState.contentHeight;
      }
      if (newAppState.sunGameTargets !== this.sunGameTargets) {
        this.sunGameTargets = newAppState.sunGameTargets;
      }
      if (newAppState.blockAll !== this.blockAll) {
        this.blockAll = newAppState.blockAll;
      }
      if (newAppState.volume !== this.volume) {
        this.volume = newAppState.volume;
      }
    });

    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language;
      this.menuLanguageChange();
    });

    this.pageCounters$.subscribe(newPC => {
      this.pageCounters = newPC;

      this.detectIfBackButtonIsActive();
    });

  }

  startHexagonIntroAnim(): void {
    for (let i = 0; i < 6; i++) {
      this.introHexagonWithDelay(i);
    }

    // Calls change of menu after menu intro
    setTimeout(() => {
      this.changeMenu();
    }, 4000);

  }

  detectIfBackButtonIsActive(): void {
    // Need this rubbish because button hex 2 shows panel 1.
    let patchSelected;
    if (this.selected === 1) {
      patchSelected = 5
    } else {
      patchSelected = this.selected - 2;
    }
    // Check if page has changed. If not page 1 then show BACK button.
    // allowBackButton avoids the button reappearing as the pages flip back to 1.
    if (this.pageCounters.pageCounters.counters[patchSelected] > 1) {
      if (this.allowBackButton) {
        this.showBackButton = true;
      }
    } else {
      this.showBackButton = false;
      this.allowBackButton = true;
    }
  }

  ngAfterViewInit() {
    //  1 to 6 were inverted for the start animation. Order is 0,6,5,4,3,2,1
    this.hexagons = this.menuRotate.nativeElement.getElementsByClassName('hexagon-content-holder');
    this.hexagonFlips = this.menuRotate.nativeElement.getElementsByClassName('hexagon-flip');
  }

  getMenus() {
    this.dataService.getMenus().subscribe((res: any) => {
      this.allMenus = res;
      this.setUpMenu(0);
    });
  }

  setUpMenu(menu: number) {
    this.menuContent = this.allMenus["menu_" + menu];
    this.menuContentLanguage = this.allMenus["menu_" + menu];
    // this.menuContent2 = this.menuContent[2];
    if (menu === 1) {
      this.store.dispatch(new ChangeIntroState(IntroState.ALLOWCUT));
      this.menuLanguageChange();
    }
  }

  menuLanguageChange(): void {
    // Manages Click Me / Home button
    this.menuContentLanguage = [this.menuContent[0]];
    if (this.menuContent.length !== 0 && this.menuContent[2].indexOf("##") >= 0) {
      for (let i = 1, length = this.menuContent.length; i < length; i++) {
        const contentText = this.menuContent[i].split("##");
        const twoPossibles = contentText[1].split("#");
        let newText;
        if (this.introState !== 'done' && this.introState !== 'onFinalAnim' && i === 2) {
          newText = this.language == "Fr" ? "Cliquer" : "Click Me";
        } else {
          newText = this.language == "Fr" ? twoPossibles[0] : twoPossibles[1];
        }
        this.menuContentLanguage.push(contentText[0] + newText + contentText[2]);
      }
    } else {
      this.menuContentLanguage = this.menuContent;
    }
    this.daTextContent = this.language == "Fr" ? "LA SELECTION par WEB WORKERS" : "THE SELECTION by WEB WORKERS";
    this.toolsTextContent = this.language == "Fr" ? "---- OUTILS ---- OUTILS ---- OUTILS " : "----- TOOLS ----- TOOLS ----- TOOLS ";
  }

  // Hexagons open/rotate one after the other
  introHexagonWithDelay(index: number) {
    let delayTime = index * 200 + 2000;
    let timeoutId = setTimeout(() => {
      this.hexOpened[index] = true;
    }, delayTime);
  }

  changeMenu() {
    this.hexOpened = [false, false, false, false, false, false]; // Menu closes
    setTimeout(() => {
      // After pause, open menu with new button content
      this.setUpMenu(1); // Change menu content. To do : refactor and clean up
      this.hexOpened = [true, true, true, true, true, true];
      // this.manageMenu(2);
    }, 1000);
  }

  clickHexagon(hexIndex: any, location: any, overrideBlock?: boolean) {

    if (this.blockAll && !overrideBlock) return;

    if (this.introState === IntroState.BLOCKALL) {
      return
    }

    if (this.introState === IntroState.ALLOWCUT) {

      if (hexIndex === 2) {
        this.store.dispatch(new ChangeIntroState(IntroState.ONFINALANIM));
      }
    }

    if (this.introState === IntroState.DONE) {
      this.manageMenu(hexIndex);
    }
  }

  manageMenu(hexIndex: number | null | undefined) {
    if ((hexIndex !== 0) && (hexIndex !== null) && (hexIndex !== undefined)) {

      if (this.volume > 0) {
        this.hexSound.volume(this.volume);
        this.hexSound.play();
      }

      if (this.selected !== null) {
        this.lastSelected = this.selected;
      }

      let rotationToAdd = (this.lastSelected - hexIndex) * 60;
      if (hexIndex == 1 && (rotationToAdd == 300 || rotationToAdd == 240)) {
        rotationToAdd -= 360;
      }
      if (hexIndex == 2 && rotationToAdd == 240) {
        rotationToAdd -= 360;
      }
      if (hexIndex == 5 && rotationToAdd == -240) {
        rotationToAdd += 360;
      }
      if (hexIndex == 6 && (rotationToAdd == -300 || rotationToAdd == -240)) {
        rotationToAdd += 360;
      }
      if (rotationToAdd) {
        this.menuRotation += rotationToAdd;
      }

      if (rotationToAdd) {
        const rotation: Rotation = { degrees: rotationToAdd }
        this.store.dispatch(new ChangeRotation(rotation));
        this.rotateMenu();
      }

      this.selected = hexIndex;
      const activePanelNumber: ActivePanelNumber = { apn: hexIndex - 1 }
      this.store.dispatch(new ChangePanelNumber(activePanelNumber));

      this.detectIfBackButtonIsActive();

      // Manage direct access
      if (hexIndex !== 2) {
        this.disactivateDirectAccess();
      } else {
        this.activateDirectAccess();
      }

    }
  }

  rotateMenu() {
    if (this.menuRotate) {
      this.menuRotate.nativeElement.style.transform = "rotate(" + this.menuRotation + "deg)"
      this.hexagonContentRotate();
    }
  }

  hexagonContentRotate() {
    // Keeps the contents of hexagons horizontal, as the menu turns.
    // Remember that 1 to 6 were inverted for the start animation. Order is 0,6,5,4,3,2,1
    this.hexagons[0].style.transform = "rotate(" + (this.menuRotation * -1) + "deg)";
    this.hexagons[1].style.transform = "rotate(" + (this.menuRotation + 240) + "deg)";
    this.hexagons[2].style.transform = "rotate(" + (this.menuRotation + 180) + "deg)";
    this.hexagons[3].style.transform = "rotate(" + (this.menuRotation + 120) + "deg)";
    this.hexagons[4].style.transform = "rotate(" + (this.menuRotation + 60) + "deg)";
    this.hexagons[5].style.transform = "rotate(" + (this.menuRotation) + "deg)";
    this.hexagons[6].style.transform = "rotate(" + (this.menuRotation - 60) + "deg)";
  }

  overHexagon(index: number) {
    if (this.blockAll) return;
    if (this.introState !== 'done') return;
    this.rolled = index;
  }

  leaveHexagon() {
    if (this.blockAll) return;
    if (this.introState !== 'done') return;
    this.rolled = null;
  }

  clickBack(): void {
    if (this.allowBackButton === true && !this.blockAll) {
      this.showBackButton = false;
      this.allowBackButton = false;
      this.store.dispatch(new BackButtonClick(true));
    }
  }

  touchstartCatapult(event: TouchEvent): void {
    if (this.allowCatapult === true) {
      this.slingWasPressed = true;
      this.slingButton.nativeElement.style.opacity = 0;
      this.startPoint.x = event.touches[0].clientX;
      this.startPoint.y = event.touches[0].clientY;
      this.eggSight.nativeElement.style.opacity = 0.3;
    }
  }

  mousedownCatapult(event: MouseEvent): void {
    if (this.allowCatapult === true) {
      this.slingWasPressed = true;
      this.slingButton.nativeElement.style.opacity = 0;
      this.startPoint.x = event.clientX;
      this.startPoint.y = event.clientY;
      this.eggSight.nativeElement.style.opacity = 0.3;
    }
  }

  touchmoveCatapult(event: TouchEvent): void {
    if (this.allowCatapult === true && this.slingWasPressed === true) {
      event.preventDefault();
      this.movePoint.x = event.touches[0].clientX;
      this.movePoint.y = event.touches[0].clientY;
      this.manageCatapult();
    }
  }

  mousemoveCatapult(event: MouseEvent): void {
    if (this.allowCatapult === true && this.slingWasPressed === true) {
      event.preventDefault();
      this.movePoint.x = event.clientX;
      this.movePoint.y = event.clientY;
      this.manageCatapult();
    }
  }

  manageCatapult(): void {

    let AB = this.movePoint.x - this.startPoint.x;
    let AC = this.movePoint.y - this.startPoint.y;
    let BC = Math.sqrt((AB * AB) + (AC * AC));

    let angle = Math.atan2(BC, AB) * (180 / Math.PI);

    this.catapult.nativeElement.style.transform = "rotateZ(" + (angle - 90) + "deg)";

    const lowerLimit = 20;
    const upperLimit = 100;
    const lowerTop = -70;
    const upperTop = -(200 + this.contentHeight);

    if (BC < lowerLimit) {
      this.eggSight.nativeElement.style.top = "-70px";
    } else {
      if (BC > upperLimit) {
        this.eggSight.nativeElement.style.top = "-500px";
      } else {
        const percent = BC / (upperLimit - lowerLimit) * 100;
        const topDist = (upperTop - lowerTop) / 100 * percent;
        this.eggSight.nativeElement.style.top = topDist + "px";
      }
    }
    this.leftElastic.nativeElement.style.height = BC + 1 + "px";
    this.rightElastic.nativeElement.style.height = BC + 1 + "px";

    if (this.leftElastic.nativeElement.clientWidth > this.leftElastic.nativeElement.clientHeight) {
      this.leftElastic.nativeElement.style.opacity = 0;
      this.rightElastic.nativeElement.style.opacity = 0;
    } else {
      this.leftElastic.nativeElement.style.opacity = 100;
      this.rightElastic.nativeElement.style.opacity = 100;
    }

    this.egg.nativeElement.style.top = BC + "px";
    this.slingLeft.nativeElement.style.top = BC + "px";
    this.slingRight.nativeElement.style.top = BC + "px";
    // }
  }

  touchendCatapult(event: TouchEvent): void {
    this.releaseCatapult()
  }

  mouseupCatapult(event: Event): void {
    this.releaseCatapult()
  }

  releaseCatapult(): void {
    if (this.allowCatapult === true && this.slingWasPressed === true) {
      this.slingWasPressed = false;
      this.allowCatapult = false;
      // this.slingButton.nativeElement.style.opacity = 1;
      this.eggSight.nativeElement.style.opacity = 0;

      let AB = this.movePoint.x - this.startPoint.x;
      let AC = this.movePoint.y - this.startPoint.y;
      let BC = Math.sqrt((AB * AB) + (AC * AC));

      // Bring sling and egg back to centre
      let transition = 'all 100ms linear';
      this.egg.nativeElement.style.transition = transition;
      this.slingRight.nativeElement.style.transition = transition;
      this.slingLeft.nativeElement.style.transition = transition;
      this.leftElastic.nativeElement.style.transition = transition;
      this.rightElastic.nativeElement.style.transition = transition;
      this.egg.nativeElement.style.top = "0";
      this.slingRight.nativeElement.style.top = "0";
      this.slingLeft.nativeElement.style.top = "0";

      this.leftElastic.nativeElement.style.height = "1px";
      this.rightElastic.nativeElement.style.height = "1px";

      setTimeout(() => {
        this.leftElastic.nativeElement.style.opacity = "0";
        this.rightElastic.nativeElement.style.opacity = "0";
      }, 40);

      if (this.volume > 0) {
        this.catapultSound.volume(this.volume);
        this.catapultSound.play();

        this.eggFlightSound.volume(this.volume);
        this.eggFlightSound.play();
      }

      // Calculate transition time for egg depending on catapult pull
      let transitionSpeed;
      if (BC < 20) {
        transitionSpeed = 500;
      } else {
        if (BC > 100) {
          transitionSpeed = 1000;
        } else {
          transitionSpeed = 750;
        }
      }

      this.eggShadow.nativeElement.style.transition = 'all ' + transitionSpeed / 2 + 'ms linear';
      setTimeout(() => {
        this.eggShadow.nativeElement.style.left = "10px";
        this.eggShadow.nativeElement.style.width = "25px";
        this.eggShadow.nativeElement.style.height = "25px";
      }, transitionSpeed / 2);

      // Wait for the sling and egg to centre before setting egg to final position
      setTimeout(() => {
        if (BC < 20) {
          this.egg.nativeElement.style.top = "-70px";
        } else {
          if (BC > 100) {
            this.egg.nativeElement.style.top = "-500px";
          } else {
            this.egg.nativeElement.style.top = this.eggSight.nativeElement.style.top;
          }
        }
        this.eggShadow.nativeElement.style.left = "-25px";
        this.eggShadow.nativeElement.style.width = "50px";
        this.eggShadow.nativeElement.style.height = "40px";
        this.egg.nativeElement.style.transition = 'all ' + transitionSpeed + 'ms ease-out';
        this.store.dispatch(new ChangeEggState(true));
      }, 100);

      let eggInfo: EggInfo

      // Detect if the egg hits a head
      let sightRect = this.eggSight.nativeElement.getBoundingClientRect();
      let sightCentreH = sightRect.left + ((sightRect.right - sightRect.left) / 2);
      let sightCentreV = sightRect.top + ((sightRect.bottom - sightRect.top) / 2);
      let targetHit: number | undefined = undefined;
      let percentLeft, percentTop;
      // Parse the head targets and check for collision
      for (let i = 0, length = this.sunGameTargets.length; i < length; i++) {
        let target = this.sunGameTargets[i];
        let totalDistanceH = target.right - target.left;
        let sightDistanceH = sightCentreH - target.left;
        percentLeft = Math.floor(sightDistanceH / totalDistanceH * 100);
        if (percentLeft >= 10 && percentLeft <= 90) {
          let totalDistanceV = target.bottom - target.top;
          let sightDistanceV = sightCentreV - target.top;
          percentTop = Math.floor(sightDistanceV / totalDistanceV * 100);
          if (percentTop >= 10 && percentTop <= 100) {
            targetHit = i + 1;
            eggInfo = { targetHit: targetHit, percentLeft: percentLeft, percentTop: percentTop }
            break;
          }
        }
      }

      // When egg has reached destination send it back for next shot
      // Transmit the egg info - target and position
      setTimeout(() => {
        if (this.volume > 0) {
          if (targetHit) {
            this.eggSmashSound.volume(this.volume);
            this.eggSmashSound.play();
          }
        }
        this.store.dispatch(new ChangeEggState(false));
        this.egg.nativeElement.style.transition = 'none';
        this.slingLeft.nativeElement.style.transition = 'none';
        this.slingRight.nativeElement.style.transition = 'none';
        this.leftElastic.nativeElement.style.transition = 'none';
        this.rightElastic.nativeElement.style.transition = 'none';
        this.eggShadow.nativeElement.style.transition = 'none';
        this.egg.nativeElement.style.top = "0";
        this.eggShadow.nativeElement.style.left = "10px";
        this.eggShadow.nativeElement.style.width = "25px";
        this.eggShadow.nativeElement.style.height = "25px";
        if (eggInfo) {
          this.store.dispatch(new TransmitEggInfo(eggInfo));
        }
        this.allowCatapult = true;
      }, transitionSpeed + 100);

    }
  }


  //-------------------------------------

  activateDirectAccess(): void {
    if (!this.daActivated) {
      this.daTarantulaIsOut = true;
      this.daTarantulaIsMoving = true;
      this.daActivated = true;
      setTimeout(() => {
        this.daTarantulaIsMoving = false;
      }, 2000);
    }
  }

  disactivateDirectAccess(): void {
    if (this.daActivated) {
      if (this.directAccessOpen) {
        this.directAccessOpen = false;
        setTimeout(() => {
          this.daTarantulaIsOut = false;
          setTimeout(() => {
            this.daTarantulaIsMoving = false;
          }, 1000);
        }, 1000);
      } else {
        this.daTarantulaIsOut = false;
      }
      setTimeout(() => {
        this.daTarantulaIsOut = false;
        setTimeout(() => {
          this.daTarantulaIsMoving = false;
        }, 1000);
      }, 1000);
      this.daTarantulaIsMoving = true;
      this.daActivated = false;
    }
  }

  manageDirectAccess() {
    if (this.daActivated) {
      this.directAccessOpen = !this.directAccessOpen;
      this.daTarantulaIsMoving = true;
      if (this.volume > 0) {
        this.spiderFeetSound.volume(this.volume);
        this.spiderFeetSound.play();
      }
      setTimeout(() => {
        this.daTarantulaIsMoving = false;
        this.spiderFeetSound.stop();
      }, 1000);
    }
  }

  directAccessWW(version: number): void {

    this.store.dispatch(new ChangeBlockAllState(true));

    if (version === 1) {
      const myHexNum = 3;

      const myContainer = '/container' + (myHexNum + 1);
      const myDegrees = this.myDegreesArray[myHexNum - 1];

      this.hexagons[0].style.transform = "rotate(" + myDegrees + "deg)";

      this.tarantulaHolder.nativeElement.style.transform = "rotate(" + myDegrees + "deg)";

      this.domeTarantulaHolder.nativeElement.style.transform = "rotate(" + myDegrees + "deg)";
      this.daTarantulaIsMoving = true;
      this.spiderFeetSound.loop = true;
      if (this.volume > 0) {
        this.spiderFeetSound.volume(this.volume);
        this.spiderFeetSound.play();
      }

      let hexBoxState: HexBoxInterface = { topOpen: true, bottomOpen: false };

      // Spider appears
      setTimeout(() => {
        this.store.dispatch(new ChangeHexBox(hexBoxState));
        this.tarantulaIsOut = true;
        this.tarantulaIsMoving = true;
        this.daTarantulaIsForward = true;
      }, 1000);

      setTimeout(() => {
        this.tarantulaIsMoving = false;
        // this.spiderFeetSound.stop();
      }, 3000);

      setTimeout(() => {
        hexBoxState = { topOpen: false, bottomOpen: false };
        this.store.dispatch(new ChangeHexBox(hexBoxState));
        this.tarantulaHolder.nativeElement.style.transform = "rotate(0deg)";
        this.clickHexagon(myHexNum, myContainer, true);
      }, 4000);

      setTimeout(() => {
        this.initNextMove(document.getElementById("contentLayout"), 50, 110);
        this.tarantulaIsMoving = true;
        if (this.volume > 0) {
          this.spiderFeetSound.play();
        }
      }, 5000);

      setTimeout(() => {
        this.tarantulaIsMoving = false;
        this.spiderFeetSound.stop();
        const directAccess = { hexNum: myHexNum - 1, nPage: 2, degrees: 0, subPageNum: 2 };
        this.store.dispatch(new AccessPanelDirect(directAccess));
      }, 8000);

      setTimeout(() => {
        this.initNextMove(document.getElementById("airbusPlay"), 70, 150);
        this.tarantulaHolder.nativeElement.firstElementChild.firstElementChild.style.rotate = "130deg";
        this.tarantulaIsMoving = true;
        if (this.volume > 0) {
          this.spiderFeetSound.play();
        }
      }, 9000);

      setTimeout(() => {
        this.tarantulaIsMoving = false;
        this.spiderFeetSound.stop();
        this.store.dispatch(new RobotAirbusAnim());
      }, 12000);

      setTimeout(() => {
        this.tarantulaIsMoving = true;
        if (this.volume > 0) {
          this.spiderFeetSound.play();
        }
        this.tarantulaHolder.nativeElement.style.top = "-103px";
        this.tarantulaHolder.nativeElement.style.left = "calc(50% - 50px)";
        this.tarantulaHolder.nativeElement.firstElementChild.firstElementChild.style.rotate = "220deg";
      }, 13000);

      setTimeout(() => {
        this.tarantulaIsMoving = false;
        this.spiderFeetSound.stop();
        hexBoxState = { topOpen: true, bottomOpen: false };
      }, 16000);

      setTimeout(() => {
        hexBoxState = { topOpen: true, bottomOpen: false };
        this.store.dispatch(new ChangeHexBox(hexBoxState));
        this.tarantulaHolder.nativeElement.firstElementChild.firstElementChild.style.rotate = "180deg";
        this.tarantulaIsOut = false;
        this.tarantulaIsMoving = true;
        this.daTarantulaIsOut = false;
        this.daTarantulaIsForward = false;
        this.daTarantulaIsMoving = true;
        if (this.volume > 0) {
          this.spiderFeetSound.volume(this.volume);
          this.spiderFeetSound.play();
        }
        this.domeTarantulaHolder.nativeElement.style.transform = "rotate(0deg)";
      }, 17000);

      setTimeout(() => {
        hexBoxState = { topOpen: false, bottomOpen: false };
        this.store.dispatch(new ChangeHexBox(hexBoxState));
        this.tarantulaIsMoving = false;
        this.spiderFeetSound.stop();
        this.tarantulaHolder.nativeElement.firstElementChild.firstElementChild.style.rotate = "0deg";
      }, 19000);

      // setTimeout(() => {
      //   hexBoxState = { topOpen: false, bottomOpen: false };
      //   this.store.dispatch(new ChangeHexBox(hexBoxState));
      //   this.tarantulaIsMoving = false;
      //   this.tarantulaHolder.nativeElement.firstElementChild.firstElementChild.style.rotate = "0deg";
      // }, 19000);

      setTimeout(() => {
        this.store.dispatch(new ChangeBlockAllState(false));
      }, 20000);
    } else {
      const myHexNum = 5;

      const myContainer = '/container' + (myHexNum + 1);
      const myDegrees = this.myDegreesArray[myHexNum - 1];

      this.hexagons[0].style.transform = "rotate(" + myDegrees + "deg)";

      this.tarantulaHolder.nativeElement.style.transform = "rotate(" + myDegrees + "deg)";

      this.domeTarantulaHolder.nativeElement.style.transform = "rotate(" + myDegrees + "deg)";
      this.daTarantulaIsMoving = true;
      this.spiderFeetSound.play();

      let hexBoxState: HexBoxInterface = { topOpen: true, bottomOpen: false };

      setTimeout(() => {
        this.store.dispatch(new ChangeHexBox(hexBoxState));
        this.tarantulaIsOut = true;
        this.tarantulaIsMoving = true;
        this.daTarantulaIsForward = true;
      }, 1000);

      setTimeout(() => {
        this.tarantulaIsMoving = false;
        this.spiderFeetSound.stop();
      }, 3000);

      setTimeout(() => {
        this.tarantulaHolder.nativeElement.style.transform = "rotate(0deg)";
        this.domeTarantulaHolder.nativeElement.style.transform = "rotate(0deg)";
        this.clickHexagon(myHexNum, myContainer, true);
      }, 4000);

      setTimeout(() => {
        this.tarantulaIsMoving = true;
        if (this.volume > 0) {
          this.spiderFeetSound.play();
        }
        this.tarantulaIsOut = false;
        this.daTarantulaIsForward = false;
        this.daTarantulaIsMoving = true;
      }, 7000);

      setTimeout(() => {
        this.daTarantulaIsOut = false;
        this.spiderFeetSound.stop();
        hexBoxState = { topOpen: false, bottomOpen: false };
        this.store.dispatch(new ChangeHexBox(hexBoxState));
      }, 8000);

      setTimeout(() => {
        this.store.dispatch(new ChangeBlockAllState(false));
      }, 9000);
    }

  }

  initNextMove(nextTarget: any, correctionX: number, correctionY: number): void {
    let nextRect, nextX, nextY, taraRect, taraX, taraY;
    nextRect = nextTarget.getBoundingClientRect();
    nextX = (nextRect.x + nextRect?.width / 2);
    nextY = (nextRect.y + nextRect?.height / 2);
    taraRect = this.tarantulaHolder.nativeElement.getBoundingClientRect();
    taraX = (taraRect.x + taraRect?.width / 2);
    taraY = (taraRect.y + taraRect?.height / 2);
    const diffX = nextX - taraX;
    const diffY = nextY - taraY;

    let offsetY = this.otherStuff.nativeElement.getBoundingClientRect().y;

    let newX = (taraX + diffX - correctionX) + "px";
    let newY = (taraY + diffY - (offsetY + correctionY)) + "px";
    this.tarantulaHolder.nativeElement.style.left = newX;
    this.tarantulaHolder.nativeElement.style.top = newY;
  }


  activateTools(): void {
    this.toolsActivated = true;
    this.toolsAreOut = true;
    this.toolsAreMoving = true;
    setTimeout(() => {
      this.toolsAreMoving = false;
    }, 1000);
  }

  manageTools() {
    if (this.toolsActivated) {
      if (this.volume > 0) {
        this.hToolsSound.volume(this.volume)
        this.hToolsSound.play();
      }
      setTimeout(() => {
        this.hToolsSound.stop();
      }, 1000);
      if (this.toolsOpen) {
        this.toolsOpen = false;
        this.toolsAreMoving = false;
      } else {
        this.toolsOpen = true;
        this.toolsAreMoving = true;
      }
    }
  }

}