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
import { AppStateModel } from 'app/store/general/general.model';
import { AppState } from 'app/store/general/general.state';
import { ChangeAppState } from 'app/store/general/general.actions';

@Component({
  selector: 'hexagon-group',
  standalone: true,
  imports: [NgClass, NgIf, HexagonComponent],
  providers: [DataService],
  templateUrl: './hexagon-group.component.html',
  styleUrls: ['./hexagon-group.component.scss']
})

export class HexagonGroupComponent implements OnInit, AfterViewInit {

  @Select(DirectAccess) directAccess$!: Observable<DirectAccessModel>;
  @Select(AppState) appState$!: Observable<AppStateModel>;

  @ViewChild('menuRotate')
  menuRotate!: ElementRef;

  appState!: AppStateModel;
  onIntro!: boolean;

  constructor(private dataService: DataService, private router: Router, private store: Store) {
  }

  public menuContent: Array<any> = [];
  public menuContent2!: string;
  public hexOpened: Array<any> = [];
  private allMenus!: any;
  public selected!: number;
  private lastSelected!: number;
  private menuRotation: number = 0;
  public rolled: number | null = null;
  private hexagons: Array<any> = [];
  // private onIntro: boolean = false;
  private menuAnimationFinished: boolean = false;

  private introDone: boolean = false;
  private allowCut: boolean = false;

  ngOnInit() {

    this.lastSelected = 0;

    this.getMenus();

    // this.onIntro = true;

    this.hexOpened = [false, false, false, false, false, false];

    this.menuAnimationFinished = false;

    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        this.introHexagonWithDelay(i);
      }
    }, 1000);


    // Calls change of menu after menu intro
    setTimeout(() => {
      // this.onIntro = false;
      this.changeMenu();
    }, 5000);

    this.directAccess$.subscribe(newDA => {
      if (newDA.directAccess.hexNum) {
        this.manageMenu(newDA.directAccess.hexNum + 1);
      }
    });

    this.appState$.subscribe(newAppState => {
      this.appState = newAppState;
      this.onIntro = this.appState.appState.onIntro;

      if (this.onIntro === false && this.introDone === false) {
        this.introDone = true;
        this.manageMenu(2);
      }
      // console.log("XXXXXXXXXXXXXXXXXX", this.appState);


      // console.log("this.menuContent", this.menuContent);
      // console.log("this.content",this.content);
      // debugger;
      if (this.menuContent.length !== 0 && this.menuContent[2].indexOf("##") >= 0) {
        // const contentText = this.menuContent[2].split("##");
        // const twoPossibles = contentText[1].split("#");
        // let newText = this.onIntro ? twoPossibles[0] : twoPossibles[1];
        // this.menuContent[2] = contentText[0] + newText + contentText[2];
        this.updateMenuHack();
      }
    });
  }

  ngAfterViewInit() {
    // Remember that 1 to 6 were inverted for the start animation. Order is 0,6,5,4,3,2,1
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
    this.menuContent2 = this.menuContent[2];
    this.updateMenuHack();
  }

  updateMenuHack(): void {
    // Manages Click Me / Home button
    if (this.menuContent.length !== 0 && this.menuContent[2].indexOf("##") >= 0) {
      const contentText = this.menuContent[2].split("##");
      const twoPossibles = contentText[1].split("#");
      let newText = this.onIntro ? twoPossibles[0] : twoPossibles[1];
      this.menuContent2 = contentText[0] + newText + contentText[2];
      this.allowCut = true;
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
    console.log("this.allowCut", this.allowCut);
    if (this.onIntro) {
      if(this.allowCut) {
        let appState: AppStateModel;
        appState = { appState: { onIntro: false, mouseUpDetected: this.appState.appState.mouseUpDetected } };
        this.store.dispatch(new ChangeAppState(appState.appState));
      }
    } else {
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
    if (this.onIntro) return;
    this.rolled = index;
  }

  leaveHexagon() {
    if (this.onIntro) return;
    this.rolled = null;
  }

}