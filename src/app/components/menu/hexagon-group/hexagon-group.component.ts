import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, signal, Signal } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { Store } from '@ngxs/store';
import { Location, NgClass, NgIf } from '@angular/common';
import { DataService } from '../../../shared/services/data.service';
import { HexagonComponent } from '../hexagon/hexagon.component';
import { Rotation } from '../../../shared/interfaces/rotation';
import { ChangeRotation } from '../../../store/rotation/rotation.action';

@Component({
  selector: 'hexagon-group',
  standalone: true,
  imports: [NgClass, NgIf, HexagonComponent],
  providers: [DataService],
  templateUrl: './hexagon-group.component.html',
  styleUrls: ['./hexagon-group.component.scss']
})

export class HexagonGroupComponent implements OnInit, AfterViewInit {

  @ViewChild('menuRotate')
  menuRotate!: ElementRef;

  constructor(private dataService: DataService, private router: Router, private store: Store) {
  }

  public menuContent: Array<any> = [];
  public hexOpened: Array<any> = [];
  private allMenus!: any;
  public selected!: number;
  private lastSelected!: number;
  private menuRotation: number = 0;
  public rolled: number | null = null;
  private hexagons: Array<any> = [];
  private onIntro: boolean = false;
  private menuAnimationFinished: boolean = false;

  ngOnInit() {

    this.lastSelected = 2;

    this.getMenus();

    this.onIntro = true;

    this.hexOpened = [false, false, false, false, false, false];

    this.menuAnimationFinished = false;

    for (let i = 0; i < 6; i++) {
      this.introHexagonWithDelay(i);
    }

    // Calls change of menu after menu intro
    setTimeout(() => {
      this.onIntro = false;
      this.changeMenu();
    }, 5000);

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
      this.manageMenu(2);
    }, 1000);
  }

  clickHexagon(hexIndex: any, location: any) {
    if (this.onIntro) return;
    this.manageMenu(hexIndex);
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