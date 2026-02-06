import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatchComponent } from './reusable/match/match.component';
import { ElementData } from '../../shared/types';
import { StateService } from '../../services/state.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-enigma',
  imports: [NgClass, MatchComponent],
  templateUrl: './enigma.component.html',
  styleUrl: './enigma.component.scss',
})
export class EnigmaComponent {

  protected state = inject(StateService);
  protected language = inject(LanguageService);

  readonly earth = viewChild.required<ElementRef>('earth');
  readonly wind = viewChild.required<ElementRef>('wind');
  readonly fire = viewChild.required<ElementRef>('fire');
  readonly water = viewChild.required<ElementRef>('water');
  readonly scrollTarget = viewChild.required<ElementRef>('scrollTarget');

  appWidth!: number;
  appHeight!: number;
  sackHides: boolean = false;
  doneEarth: boolean = false;
  doneWind: boolean = false;
  doneFire: boolean = false;
  doneWater: boolean = false;
  scrollOpen: boolean = false;
  scrollFallen: boolean = false;
  enigmaEnd: boolean = false;
  matchLit: boolean = false;

  elementData!: Array<ElementData>;
  // scrollData!: DOMRect;

  ngOnInit() {
    this.appWidth = window.innerWidth;
    this.appHeight = window.innerHeight;

    // setTimeout(() => {
    //   this.state.setSection('content');
    // }, 5000);

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.elementData = [
        { element: "earth", boundingRect: this.earth().nativeElement.getBoundingClientRect() },
        { element: "wind", boundingRect: this.wind().nativeElement.getBoundingClientRect() },
        { element: "fire", boundingRect: this.fire().nativeElement.getBoundingClientRect() },
        { element: "water", boundingRect: this.water().nativeElement.getBoundingClientRect() }
      ];
    });
  }

  readOutputMoveFigureValue(value: boolean) {
    this.sackHides = value;
  }

  readOutputBurntElementsValue(value: any) {
    this.doneEarth = value[0];
    this.doneWind = value[1];
    this.doneFire = value[2];
    this.doneWater = value[3];
  }

  readOutputScrollFallenValue(value: boolean) {
    this.scrollFallen = value;
    setTimeout(() => {
      this.scrollOpen = true;
    }, 500);
  }

  readOutputWallsOpenValue(value: boolean) {
    this.state.setSection('CONTENT');
    this.enigmaEnd = value;
    this.scrollOpen = false

  }

  readOutputMatchLit(value: boolean) {
    this.matchLit = value;
  }

  zappEnigma() {
    this.state.setSection('CONTENT');
    this.enigmaEnd = true;
    this.scrollOpen = false;
  }
}
