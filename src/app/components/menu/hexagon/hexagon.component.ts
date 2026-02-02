import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { SunGameState } from 'app/store/general/general.model';
import { HexBoxInterface } from 'app/shared/interfaces/hexagon'

@Component({
    selector: 'app-hexagon',
    imports: [NgClass],
    templateUrl: './hexagon.component.html',
    styleUrls: ['./hexagon.component.scss']
})
export class HexagonComponent {

  // @ViewChild('menuMagic') menuMagic: ElementRef;
  // @ViewChild('topHalf') topHalf: ElementRef;
  // @ViewChild('bottomHalf') bottomHalf: ElementRef;

  // 

  @Input() content: string | undefined;
  @Input() hexNum!: number;
  @Input() sunGameState!: SunGameState;
  @Input() hexbox!: HexBoxInterface;

  menuMagic!: HTMLElement;
  topHalf!: HTMLElement;
  bottomHalf!: HTMLElement

  rolled: boolean | undefined;
  openState: boolean | undefined;

  constructor() { }


  // ngAfterViewInit() {
  //   this.menuMagic = document.getElementsByClassName("menu-magic")[0] as HTMLElement;
  //   this.topHalf = document.getElementsByClassName("top-half")[0] as HTMLElement;
  //   this.bottomHalf = document.getElementsByClassName("bottom-half")[0] as HTMLElement;
  // }

  ngOnChanges(changes: any) {
    if (changes.content && changes.content.currentValue && changes.content.currentValue.indexOf("menuMagic") > -1) {
      // Timeout allows content to be injected to the DOM before getting elements
      setTimeout(() => {
        this.menuMagic = document.getElementsByClassName("menu-magic")[0] as HTMLElement;
        this.topHalf = document.getElementsByClassName("top-half")[0] as HTMLElement;
        this.bottomHalf = document.getElementsByClassName("bottom-half")[0] as HTMLElement;
        if (this.menuMagic) {
          this.menuMagic.style.visibility = "visible";
          this.topHalf.style.background = "black";
          this.bottomHalf.style.background = "white";
          this.topHalf.style.top = "0px";
          this.bottomHalf.style.top = "26px";
        }
      }, 1000);
    }
    if (changes.sunGameState) {
      if (changes.sunGameState.currentValue === SunGameState.GAMEON) {
        if (this.topHalf) {
          this.topHalf.style.top = "-26px";
          this.bottomHalf.style.top = "52px";
        }
      } else {
        if (this.topHalf) {
          this.topHalf.style.top = "0px";
          this.bottomHalf.style.top = "26px";
        }
      }
    }

    if (changes.hexbox) {
      if (changes.hexbox.currentValue.topOpen === true) {
        if (this.topHalf) {
          this.topHalf.style.top = "-26px";
        }
      } else {
        if (this.topHalf) {
          this.topHalf.style.top = "0px";
        }
      }
    }


  }



}