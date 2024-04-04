import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.updateLayout();
  }

  constructor() { }

  screenWidth!: number;
  screenHeight!: number;

  ngAfterViewInit(): void {

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    if(this.screenWidth < this.screenHeight) {
      this.contentLayout.nativeElement.style["height"] = this.screenHeight / 4 * 3 + 'px';
      this.contentLayout.nativeElement.style["width"] = '100%';
      this.contentLayout.nativeElement.style["top"] = '0';
      this.contentLayout.nativeElement.style["left"] = '0';
  
      this.menuLayout.nativeElement.style["height"] = this.screenHeight / 4 + 'px';
      this.menuLayout.nativeElement.style["width"] = '100%';
      this.menuLayout.nativeElement.style["bottom"] = '0';
      this.menuLayout.nativeElement.style["left"] = '0';
    } else {
      this.contentLayout.nativeElement.style["width"] = this.screenWidth / 4 * 3 + 'px';
      this.contentLayout.nativeElement.style["height"] = '100%';
      this.contentLayout.nativeElement.style["top"] = '0';
      this.contentLayout.nativeElement.style["left"] = '0';
  
      this.menuLayout.nativeElement.style["width"] = this.screenHeight / 4 + 'px';
      this.menuLayout.nativeElement.style["height"] = '100%';
      this.menuLayout.nativeElement.style["top"] = '0';
      this.menuLayout.nativeElement.style["right"] = '0';
    }

    
  }

  updateLayout() {
    this.contentLayout.nativeElement.style["height"] = this.screenHeight / 4 * 3 + 'px';
    this.menuLayout.nativeElement.style["height"] = this.screenHeight / 4 + 'px';
  }
}