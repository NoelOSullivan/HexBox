import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from './menu/menu/menu.component';
import { ContentComponent } from './content/content/content.component';
import { ArrowComponent } from '../shared/components/arrow/arrow.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MenuComponent, ContentComponent, ArrowComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent {

  @ViewChild('contentLayout') contentLayout!: ElementRef;
  @ViewChild('menuLayout') menuLayout!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    
    console.log("window.innerWidth", window.innerWidth);
    console.log("window.innerHeight", window.innerHeight);
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if(this.screenWidth != this.portraitWidth || this.screenHeight != this.portraitHeight) {
      if (this.screenWidth < this.screenHeight) {
        this.portraitWidth = this.screenWidth;
        this.portraitHeight = this.screenHeight;
        this.landscapeWidth = this.screenHeight;
        this.landscapeHeight = this.screenWidth;
      }
    } else {
      if (this.screenWidth > this.screenHeight) {
        this.portraitWidth = this.screenHeight;
        this.portraitHeight = this.screenWidth;
        this.landscapeWidth = this.screenWidth;
        this.landscapeHeight = this.screenHeight;
      }
    }
    
    this.updateLayout();
  }

  constructor() { }

  screenWidth!: number;
  screenHeight!: number;

  portraitWidth!: number;
  portraitHeight!: number;
  landscapeWidth!: number;
  landscapeHeight!: number;


  ngAfterViewInit(): void {
    console.log("-- window.innerWidth", window.innerWidth);
    console.log("-- window.innerHeight", window.innerHeight);

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth < this.screenHeight) {
      this.portraitWidth = this.screenWidth;
      this.portraitHeight = this.screenHeight;
      this.landscapeWidth = this.screenHeight;
      this.landscapeHeight = this.screenWidth;
    } else {
      this.portraitWidth = this.screenHeight;
      this.portraitHeight = this.screenWidth;
      this.landscapeWidth = this.screenWidth;
      this.landscapeHeight = this.screenHeight;
    }
    console.log("this.portraitWidth", this.portraitWidth);
    console.log("this.portraitHeight", this.portraitHeight);
    console.log("this.landscapeWidth", this.landscapeWidth);
    console.log("this.landscapeHeight", this.landscapeHeight);
    this.updateLayout();

  }

  updateLayout() {
    // this.contentLayout.nativeElement.style["height"] = this.screenHeight - 180 + 'px';
    // this.menuLayout.nativeElement.style["height"] = '180px';
    if (this.screenWidth < this.screenHeight) {
      console.log("PORTRAIT");
      // this.contentLayout.nativeElement.style["height"] = this.screenHeight - 180 + 'px';
      // debugger;
      this.contentLayout.nativeElement.style["height"] = this.portraitHeight - 180 + 'px';
      // this.contentLayout.nativeElement.style["width"] = '100%';
      this.contentLayout.nativeElement.style["width"] = this.portraitWidth + 'px';
      this.contentLayout.nativeElement.style["top"] = '0';
      this.contentLayout.nativeElement.style["left"] = '0';
      this.contentLayout.nativeElement.style["background"] = 'none';

      this.menuLayout.nativeElement.style["height"] = '180px';
      this.menuLayout.nativeElement.style["width"] = this.portraitWidth + 'px';
      this.menuLayout.nativeElement.style["bottom"] = '0';
      this.menuLayout.nativeElement.style["top"] = 'auto';
      this.menuLayout.nativeElement.style["left"] = '0';
      this.menuLayout.nativeElement.style["right"] = 'auto';
      this.menuLayout.nativeElement.style["background"] = 'none';
    } else {
      console.log("LANDSCAPE");
      // debugger;
      this.contentLayout.nativeElement.style["width"] = this.landscapeWidth - 180 + 'px';
      this.contentLayout.nativeElement.style["height"] = this.landscapeHeight + 'px';
      this.contentLayout.nativeElement.style["top"] = '0';
      this.contentLayout.nativeElement.style["left"] = '0';
      this.contentLayout.nativeElement.style["background"] = 'yellow';

      this.menuLayout.nativeElement.style["width"] = '180px';
      this.menuLayout.nativeElement.style["height"] = this.landscapeHeight + 'px';
      this.menuLayout.nativeElement.style["top"] = '0';
      this.menuLayout.nativeElement.style["bottom"] = 'auto';
      this.menuLayout.nativeElement.style["right"] = '0';
      this.menuLayout.nativeElement.style["left"] = 'auto';
      this.menuLayout.nativeElement.style["background"] = 'green';
    }
  }
}