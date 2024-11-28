import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-hexagon',
  standalone: true,
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
  @Input() sunGameOn!: boolean;

  menuMagic!: HTMLElement;
  topHalf!: HTMLElement;
  bottomHalf!: HTMLElement

  rolled: boolean | undefined;
  openState: boolean | undefined;

  constructor() { }

  ngOnChanges(changes: any) {

    if (changes.content && changes.content.currentValue && changes.content.currentValue.indexOf("menuMagic") > -1) {
      this.menuMagic = document.getElementsByClassName("menu-magic")[0] as HTMLElement;
      this.topHalf = document.getElementsByClassName("top-half")[0] as HTMLElement;
      this.bottomHalf = document.getElementsByClassName("bottom-half")[0] as HTMLElement;
      // setTimeout(() => {

      if (this.menuMagic) {
        this.menuMagic.style.visibility = "visible";
        this.topHalf.style.background = "black";
        this.bottomHalf.style.background = "white";
        this.topHalf.style.top = "0px";
        this.bottomHalf.style.top = "26px";
      }

      // this.controlsService.currentOpenState.subscribe(state => {
      //   this.openState = state;
      //   if (this.openState) {
      //     topHalf.style.top = "-26px";
      //     bottomHalf.style.top = "52px";
      //   } else {
      //     topHalf.style.top = "0px";
      //     bottomHalf.style.top = "26px";
      //   }
      // });

      // }, 1000);
    }
    if (changes.sunGameOn) {
      if (changes.sunGameOn.currentValue === true) {
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


  }



}