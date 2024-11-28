import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, Event as NavigationEvent } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Location, NgClass, NgIf } from '@angular/common';
import { DataService } from '../../../shared/services/data.service';
import { HexagonComponent } from '../hexagon/hexagon.component';
import { Rotation, ActivePanelNumber } from '../../../shared/interfaces/hexagon';
import { ChangePanelNumber, ChangeRotation } from '../../../store/hexagon/hexagon.actions';
import { DirectAccess, PageCounters } from '../../../store/panel/panel.state';
import { Observable } from 'rxjs';
import { DirectAccessModel, PageCounterModel } from '../../../store/panel/panel.model';
import { AppStateModel, IntroState, LanguageModel } from 'app/store/general/general.model';
import { AppState, Language } from 'app/store/general/general.state';
import { BackButtonClick, ChangeEggState, ChangeIntroState, TransmitEggInfo } from 'app/store/general/general.actions';
import { LangButtonComponent } from '../lang-button/lang-button.component';
import { SwipeIconComponent } from 'app/shared/components/swipe-icon/swipe-icon.component';
import { EggComponent } from 'app/shared/components/egg/egg.component';
import { UpdatePageCounter } from 'app/store/panel/panel.action';
import { DomRect, EggInfo } from 'app/shared/interfaces/general';

@Component({
  selector: 'hexagon-group',
  standalone: true,
  imports: [NgClass, NgIf, HexagonComponent, LangButtonComponent, SwipeIconComponent, EggComponent],
  providers: [DataService],
  templateUrl: './hexagon-group.component.html',
  styleUrls: ['./hexagon-group.component.scss']
})

export class HexagonGroupComponent implements OnInit, AfterViewInit {

  @Select(DirectAccess) directAccess$!: Observable<DirectAccessModel>;
  @Select(AppState) appState$!: Observable<AppStateModel>;
  @Select(Language) language$!: Observable<LanguageModel>;
  @Select(PageCounters) pageCounters$!: Observable<PageCounterModel>;
  // @Select(ActivePanelNumber) activePanelNumber$!: Observable<ActivePanelNumberModel>;

  @ViewChild('menuRotate') menuRotate!: ElementRef;
  @ViewChild('catapult') catapult!: ElementRef;
  @ViewChild('egg') egg!: ElementRef;
  @ViewChild('eggSight') eggSight!: ElementRef;
  @ViewChild('sling') sling!: ElementRef;

  appState!: AppStateModel;
  introState!: IntroState;
  sunGameOn: boolean = false;
  sunGameTargets: Array<DomRect> = [];

  showBackButton: boolean = false;
  allowBackButton: boolean = false;

  startPoint: { x: number, y: number } = { x: 0, y: 0 };
  movePoint: { x: number, y: number } = { x: 0, y: 0 };
  endPoint: { x: number, y: number } = { x: 0, y: 0 };
  vector: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private dataService: DataService, private router: Router, private store: Store) {
  }

  public menuContent: Array<any> = [];
  public menuContentLanguage: Array<any> = [];
  public menuContent2: string = "Click Me";
  public hexOpened: Array<any> = [];
  private allMenus!: any;
  public selected!: number;
  private lastSelected!: number;
  private menuRotation: number = 0;
  public rolled: number | null = null;
  private hexagons: Array<any> = [];

  private introDone: boolean = false;
  private language!: string;
  pageCounters!: PageCounterModel;
  contentHeight: number = 0;

  ngOnInit() {

    this.lastSelected = 0;

    this.getMenus();

    this.hexOpened = [false, false, false, false, false, false];

    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        this.introHexagonWithDelay(i);
      }
    }, 1000);


    // Calls change of menu after menu intro
    setTimeout(() => {
      this.changeMenu();
    }, 5000);

    this.directAccess$.subscribe(newDA => {
      if (newDA.directAccess.hexNum) {
        this.manageMenu(newDA.directAccess.hexNum + 1);
      }
    });

    this.appState$.subscribe(newAppState => {
      // To Do : this gets called every time for the mouseupoutside on wheel menus
      // It keeps being called. No good.
      this.introState = newAppState.introState;
      if (this.introState === 'onFinalAnim' && this.introDone === false) {
        this.introDone = true;
        this.menuLanguageChange();
        this.manageMenu(2);
      }
      if (this.sunGameOn !== newAppState.sunGameOn) {
        this.sunGameOn = newAppState.sunGameOn;
      }
      if (newAppState.contentHeight !== this.contentHeight) {
        this.contentHeight = newAppState.contentHeight;
      }
      if (newAppState.sunGameTargets !== this.sunGameTargets) {
        this.sunGameTargets = newAppState.sunGameTargets;
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
          newText = "Click Me";
        } else {
          newText = this.language == "Fr" ? twoPossibles[0] : twoPossibles[1];
        }
        this.menuContentLanguage.push(contentText[0] + newText + contentText[2]);
      }
    } else {
      this.menuContentLanguage = this.menuContent;
    }
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

  clickHexagon(hexIndex: any, location: any) {
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
    if (this.introState !== 'done') return;
    this.rolled = index;
  }

  leaveHexagon() {
    if (this.introState !== 'done') return;
    this.rolled = null;
  }

  clickBack(): void {
    if (this.allowBackButton === true) {
      console.log("clickBack");
      this.showBackButton = false;
      this.allowBackButton = false;
      this.store.dispatch(new BackButtonClick());
    }
  }

  touchstartCatapult(event: TouchEvent): void {
    this.startPoint.x = event.touches[0].clientX;
    this.startPoint.y = event.touches[0].clientY;
  }

  touchmoveCatapult(event: TouchEvent): void {
    this.movePoint.x = event.touches[0].clientX;
    this.movePoint.y = event.touches[0].clientY;

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

    this.egg.nativeElement.style.top = BC + "px";
    this.sling.nativeElement.style.top = BC + "px";

  }

  touchendCatapult(event: TouchEvent): void {

    let AB = this.movePoint.x - this.startPoint.x;
    let AC = this.movePoint.y - this.startPoint.y;
    let BC = Math.sqrt((AB * AB) + (AC * AC));

    // Bring sling and egg back to centre
    this.egg.nativeElement.style.transition = 'all 250ms linear';
    this.sling.nativeElement.style.transition = 'all 250ms linear';
    this.egg.nativeElement.style.top = "0";
    this.sling.nativeElement.style.top = "0";

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

    // Wait 250 for the sling and egg to centre before setting egg to final position
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
      this.egg.nativeElement.style.transition = 'all ' + transitionSpeed + 'ms ease-out';
      this.store.dispatch(new ChangeEggState(true));
    }, 250);

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
          eggInfo = {targetHit:targetHit, percentLeft:percentLeft, percentTop:percentTop}
          break;
        }
      }
    }

    // When egg has reached destination send it back for next shot
    // Transmit the egg info - target and position
    setTimeout(() => {
      this.store.dispatch(new ChangeEggState(false));
      this.egg.nativeElement.style.transition = 'none';
      this.sling.nativeElement.style.transition = 'none';
      this.egg.nativeElement.style.top = "0";
      if(eggInfo) {
        this.store.dispatch(new TransmitEggInfo(eggInfo));
      }
    }, transitionSpeed + 250);

  }

}