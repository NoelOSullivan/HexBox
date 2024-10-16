import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, Event as NavigationEvent } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Location, NgClass, NgIf } from '@angular/common';
import { DataService } from '../../../shared/services/data.service';
import { HexagonComponent } from '../hexagon/hexagon.component';
import { Rotation, ActivePanelNumber } from '../../../shared/interfaces/hexagon';
import { ChangePanelNumber, ChangeRotation } from '../../../store/hexagon/hexagon.actions';
import { DirectAccess } from '../../../store/panel/panel.state';
import { Observable } from 'rxjs';
import { DirectAccessModel } from '../../../store/panel/panel.model';
import { AppStateModel, IntroState, LanguageModel } from 'app/store/general/general.model';
import { AppState, Language } from 'app/store/general/general.state';
import { ChangeIntroState } from 'app/store/general/general.actions';
import { LangButtonComponent } from '../lang-button/lang-button.component';

@Component({
  selector: 'hexagon-group',
  standalone: true,
  imports: [NgClass, NgIf, HexagonComponent, LangButtonComponent],
  providers: [DataService],
  templateUrl: './hexagon-group.component.html',
  styleUrls: ['./hexagon-group.component.scss']
})

export class HexagonGroupComponent implements OnInit, AfterViewInit {

  @Select(DirectAccess) directAccess$!: Observable<DirectAccessModel>;
  @Select(AppState) appState$!: Observable<AppStateModel>;
  @Select(Language) language$!: Observable<LanguageModel>;

  @ViewChild('menuRotate')
  menuRotate!: ElementRef;

  appState!: AppStateModel;
  introState!: IntroState;

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
    });

    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language;
      this.menuLanguageChange();
    });

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

}