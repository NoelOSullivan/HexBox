import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-hexagon',
  standalone: true,
  imports: [NgClass],
  templateUrl: './hexagon.component.html',
  styleUrls: ['./hexagon.component.scss']
})
export class HexagonComponent implements OnInit {

  // @ViewChild('menuMagic') menuMagic: ElementRef;
  // @ViewChild('topHalf') topHalf: ElementRef;
  // @ViewChild('bottomHalf') bottomHalf: ElementRef;

  // 


  @Input() content: string | undefined;
  @Input() hexNum!: number;
  rolled: boolean | undefined;
  openState: boolean | undefined;

  constructor() { }

  ngOnInit() {
    // this.controlsService.currentOpenState.subscribe(state =>
    //   {
    //     console.log("this.openState",this.openState);
    //     this.openState = state;
    //   }
    //   );
  }

  ngOnChanges(changes: any) {
    // console.log("changes", changes.content.currentValue);
    if (changes.content.currentValue && changes.content.currentValue.indexOf("menuMagic") > -1) {
      setTimeout(() => {
        let menuMagic: HTMLElement = document.getElementsByClassName("menu-magic")[0] as HTMLElement;
        menuMagic.style.visibility = "visible";
        let topHalf: HTMLElement = document.getElementsByClassName("top-half")[0] as HTMLElement;
        let bottomHalf: HTMLElement = document.getElementsByClassName("bottom-half")[0] as HTMLElement;
        topHalf.style.background = "black";
        bottomHalf.style.background = "white";
        topHalf.style.top = "0px";
        bottomHalf.style.top = "26px";
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

      }, 1000);
    }
  }

}