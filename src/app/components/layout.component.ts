import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { MenuComponent } from './menu/menu/menu.component';
import { ContentComponent } from './content/content/content.component';
import { ArrowComponent } from '../shared/components/arrow/arrow.component';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { AppStateModel } from 'app/store/general/general.model';
import { ChangeAppState } from 'app/store/general/general.actions';
import { AppState } from 'app/store/general/general.state';
import { Observable } from 'rxjs';

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

  @Select(AppState) appState$!: Observable<AppStateModel>;

  originalShortSide!: number;
  originalLongSide!: number;

  orientation!: string;
  viewHeightOK!: boolean;

  resizeTimeout: any;
  that: any;

  appState!: AppStateModel;

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

    // console.log("window.", window.innerWidth, window.innerHeight);

    if (this.viewHeightOK) {
      this.updateLayout();
    }
  }

  @HostListener('mouseup', ['$event']) mouseup(event: MouseEvent) {
    // console.log("UPUPUPANDAWAY");

    // let appState: AppStateModel;
    // appState = { appState: { onIntro: this.appState.appState.onIntro, mouseUpDetected: !this.appState.appState.mouseUpDetected } };
    // this.store.dispatch(new ChangeAppState(appState.appState));
  }

  constructor(private store: Store) { }

  screenWidth!: number;
  screenHeight!: number;

  ngOnInit() {

    if (window.innerHeight > window.innerWidth) {
      this.originalShortSide = window.innerWidth;
      this.originalLongSide = window.innerHeight;
    } else {
      this.originalLongSide = window.innerWidth;
      this.originalShortSide = window.innerHeight;
    }

    this.viewHeightOK = this.checkViewHeight();

    this.appState$.subscribe(newAppState => {
      this.appState = newAppState;
    });
  }

  checkViewHeight(): boolean {

    if (window.innerHeight > window.innerWidth) {
      return true;
    } else {
      if (window.innerHeight > 500) {
        return true;
      }
    }
    return false;
  }

  ngAfterViewInit(): void {
    if (this.viewHeightOK) {
      this.updateLayout();
    }
  }

  updateLayout() {

    // console.log("this.originalLongSide", this.originalLongSide);
    // console.log("this.originalShortSide", this.originalShortSide);

    this.contentLayout.nativeElement.style["height"] = 'calc(100svh - 200px)';
    this.contentLayout.nativeElement.style["width"] = '100svw';
    this.contentLayout.nativeElement.style["top"] = '0';
    this.contentLayout.nativeElement.style["bottom"] = 'auto';
    this.contentLayout.nativeElement.style["left"] = '0';

    this.menuLayout.nativeElement.style["height"] = '200px';
    this.menuLayout.nativeElement.style["width"] = '100svw';
    this.menuLayout.nativeElement.style["bottom"] = '0';
    this.menuLayout.nativeElement.style["top"] = 'auto';
    this.menuLayout.nativeElement.style["left"] = '0';

    // if (window.innerHeight > window.innerWidth) {
    //   // PORTRAIT
    //   this.contentLayout.nativeElement.style["height"] = this.originalLongSide - 200 + 'px';
    //   this.contentLayout.nativeElement.style["width"] = this.originalShortSide + 'px';
    //   this.contentLayout.nativeElement.style["top"] = '0';
    //   this.contentLayout.nativeElement.style["bottom"] = 'auto';
    //   this.contentLayout.nativeElement.style["left"] = '0';

    //   this.menuLayout.nativeElement.style["height"] = '200px';
    //   this.menuLayout.nativeElement.style["width"] = this.originalShortSide + 'px';
    //   this.menuLayout.nativeElement.style["bottom"] = '0';
    //   this.menuLayout.nativeElement.style["top"] = 'auto';
    //   this.menuLayout.nativeElement.style["left"] = '0';
    // } else {
    //   // LANDSCAPE
    //   this.contentLayout.nativeElement.style["height"] = this.originalShortSide - 200 + 'px';
    //   this.contentLayout.nativeElement.style["width"] = this.originalLongSide + 'px';
    //   this.contentLayout.nativeElement.style["top"] = '0';
    //   this.contentLayout.nativeElement.style["bottom"] = 'auto';
    //   this.contentLayout.nativeElement.style["left"] = '0';

    //   this.menuLayout.nativeElement.style["height"] = '200px';
    //   this.menuLayout.nativeElement.style["width"] = this.originalLongSide + 'px';
    //   this.menuLayout.nativeElement.style["bottom"] = '0';
    //   this.menuLayout.nativeElement.style["top"] = 'auto';
    //   this.menuLayout.nativeElement.style["left"] = '0';
    // }
  }
}