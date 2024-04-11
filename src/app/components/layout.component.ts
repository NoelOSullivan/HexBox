import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { MenuComponent } from './menu/menu/menu.component';
import { ContentComponent } from './content/content/content.component';
import { ArrowComponent } from '../shared/components/arrow/arrow.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgIf, NgClass, MenuComponent, ContentComponent, ArrowComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent implements OnInit {

  @ViewChild('contentLayout') contentLayout!: ElementRef;
  @ViewChild('menuLayout') menuLayout!: ElementRef;

  originalShortSide!: number;
  originalLongSide!: number;

  orientation!: string;
  viewHeightOK!: boolean;

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.viewHeightOK = this.checkViewHeight();

    if (window.innerHeight > window.innerWidth) {
      this.originalShortSide = window.innerWidth;
      this.originalLongSide = window.innerHeight;
    } else {
      this.originalLongSide = window.innerWidth;
      this.originalShortSide = window.innerHeight;
    }
    
    if (this.viewHeightOK) {
      this.updateLayout();
    }
  }

  constructor() { }

  screenWidth!: number;
  screenHeight!: number;

  ngOnInit() {
    console.log("-- window.innerWidth", window.innerWidth);
    console.log("-- window.innerHeight", window.innerHeight);

    if (window.innerHeight > window.innerWidth) {
      this.originalShortSide = window.innerWidth;
      this.originalLongSide = window.innerHeight;
    } else {
      this.originalLongSide = window.innerWidth;
      this.originalShortSide = window.innerHeight;
    }

    console.log("SHORT: ", this.originalShortSide);
    console.log("LONG: ", this.originalLongSide);

    // this.screenWidth = window.innerWidth;
    // this.screenHeight = window.innerHeight;

    this.viewHeightOK = this.checkViewHeight();

    // this.orientation = this.checkOrientation();

    // if (this.orientation === "LANDSCAPE") {
    //   this.screenWidth = window.innerHeight;
    //   this.screenHeight = window.innerWidth;
    // } else {
    // this.screenWidth = window.innerWidth;
    // this.screenHeight = window.innerHeight;
    // }
  }

  checkViewHeight(): boolean {



    // If portrait
    // OK
    // If landscape
    // If heightOK
    // OK
    // else not OK

    //If first time and not OK
    // swithch the screenHeight vars


    if (window.innerHeight > window.innerWidth) {
      return true;
    } else {
      if (window.innerHeight > 600) {
        return true;
      }
    }
    return false;
  }

  // checkOrientation(): string {
  //   console.log("window.navigator.userAgent", window.navigator.userAgent);
  //   console.log("screen.orientation.type", screen.orientation.type);
  //   switch (screen.orientation.type) {
  //     case "portrait-primary":
  //       console.log("PORTRAIT");
  //       return "PORTRAIT";
  //     case "portrait-secondary":
  //       return "UPSIDE DOWN";
  //     case "landscape-secondary":
  //     case "landscape-primary":
  //       console.log("LANDSCAPE");
  //       return "LANDSCAPE"
  //     default:
  //       console.log("The orientation API isn't supported in this browser :(");
  //       return "NOT SUPPORTED"
  //   }
  // }

  ngAfterViewInit(): void {
    if (this.viewHeightOK) {
      this.updateLayout();
    }
  }

  updateLayout() {
    // console.log(this.screenWidth, this.screenHeight);

    // this.contentLayout.nativeElement.style["height"] = this.screenHeight - 180 + 'px';
    // this.contentLayout.nativeElement.style["width"] = this.screenWidth + 'px';
    // this.contentLayout.nativeElement.style["top"] = '0';
    // this.contentLayout.nativeElement.style["left"] = '0';

    // this.menuLayout.nativeElement.style["height"] = '180px';
    // this.menuLayout.nativeElement.style["width"] = this.screenWidth + 'px';
    // this.menuLayout.nativeElement.style["bottom"] = '0';
    // this.menuLayout.nativeElement.style["left"] = '0';

    if (window.innerHeight > window.innerWidth) {
      // PORTRAIT
      this.contentLayout.nativeElement.style["height"] = this.originalLongSide - 180 + 'px';
      this.contentLayout.nativeElement.style["width"] = this.originalShortSide + 'px';
      this.contentLayout.nativeElement.style["top"] = '0';
      this.contentLayout.nativeElement.style["bottom"] = 'auto';
      this.contentLayout.nativeElement.style["left"] = '0';

      this.menuLayout.nativeElement.style["height"] = '180px';
      this.menuLayout.nativeElement.style["width"] = this.originalShortSide + 'px';
      this.menuLayout.nativeElement.style["bottom"] = '0';
      this.menuLayout.nativeElement.style["top"] = 'auto';
      this.menuLayout.nativeElement.style["left"] = '0';
    } else {
      // LANDSCAPE
      this.contentLayout.nativeElement.style["height"] = this.originalShortSide - 180 + 'px';
      this.contentLayout.nativeElement.style["width"] = this.originalLongSide + 'px';
      this.contentLayout.nativeElement.style["top"] = '0';
      this.contentLayout.nativeElement.style["bottom"] = 'auto';
      this.contentLayout.nativeElement.style["left"] = '0';

      this.menuLayout.nativeElement.style["height"] = '180px';
      this.menuLayout.nativeElement.style["width"] = this.originalLongSide + 'px';
      this.menuLayout.nativeElement.style["bottom"] = '0';
      this.menuLayout.nativeElement.style["top"] = 'auto';
      this.menuLayout.nativeElement.style["left"] = '0';
    }
  }
}