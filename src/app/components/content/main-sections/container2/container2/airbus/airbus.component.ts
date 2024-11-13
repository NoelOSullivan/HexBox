import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { AppState } from 'app/store/general/general.state';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { AppStateModel } from 'app/store/general/general.model';
import { PlayButtonComponent } from 'app/shared/components/play-button/play-button.component';
import { BulletPointsComponent } from 'app/shared/components/bullet-points/bullet-points.component';

@Component({
  selector: 'app-airbus',
  standalone: true,
  imports: [NgIf, NgClass, PlayButtonComponent, BulletPointsComponent],
  templateUrl: './airbus.component.html',
  styleUrl: './airbus.component.scss'
})
export class AirbusComponent {

  @Select(AppState) appState$!: Observable<AppStateModel>;

  @Input() activePageNum!: number;
  @Input() myContainerIsActive!: boolean;
  @Input() myPageNum!: number;
  @Input() language!: string;
    
  @ViewChild('animHolder') animHolder!: ElementRef;
  @ViewChild('image1') image1!: ElementRef;
  @ViewChild('bullets1') bullets1!: ElementRef;
  @ViewChild('image2') image2!: ElementRef;
  @ViewChild('bullets2') bullets2!: ElementRef;
  @ViewChild('image3') image3!: ElementRef;
  @ViewChild('bullets3') bullets3!: ElementRef;
  @ViewChild('image4') image4!: ElementRef;
  @ViewChild('bullets4') bullets4!: ElementRef;
  @ViewChild('image5') image5!: ElementRef;
  @ViewChild('bullets5') bullets5!: ElementRef;
  @ViewChild('image6') image6!: ElementRef;

  animOn: boolean = false;
  contentHeight: number = 0;
  contentWidth: number = 0;
  ratio!: number;
  adaptedImageWidth!: number;
  ratio4!: number;
  adaptedImageWidth4!: number;
  ratio5!: number;
  adaptedImageWidth5!: number;
  ratio6!: number;
  adaptedImageWidth6!: number;

  timeOut1: any;
  timeOut2: any;
  timeOut3: any;
  timeOut4: any;
  timeOut5: any;
  timeOut6: any;
  timeOut7: any;

  ngAfterViewInit() {
    this.appState$.subscribe((appState) => {
      if (appState.contentHeight !== this.contentHeight) {
        this.contentHeight = appState.contentHeight;
      }
      if (appState.contentWidth !== this.contentWidth) {
        this.contentWidth = appState.contentWidth;
      }
    });
  }

  initialiseAnim() {
    if (this.image1) {
      this.image1.nativeElement.style.transition = 'none';
      this.bullets1.nativeElement.style.transition = 'none';
      this.image2.nativeElement.style.transition = 'none';
      this.bullets2.nativeElement.style.transition = 'none';
      this.image3.nativeElement.style.transition = 'none';
      this.bullets3.nativeElement.style.transition = 'none';
      this.image4.nativeElement.style.transition = 'none';
      this.bullets4.nativeElement.style.transition = 'none';
      this.image5.nativeElement.style.transition = 'none';
      this.bullets5.nativeElement.style.transition = 'none';
      this.image6.nativeElement.style.transition = 'none';

      // 19 for borders, margins...
      this.image1.nativeElement.style.left = 0;
      this.image1.nativeElement.style.opacity = 0;

      this.bullets1.nativeElement.style.opacity = 0;

      this.image2.nativeElement.style.left = Math.floor(-this.adaptedImageWidth) + (this.contentWidth - 19) + "px";
      this.image2.nativeElement.style.opacity = 0;

      this.bullets2.nativeElement.style.opacity = 0;

      this.image3.nativeElement.style.left = 0;
      this.image3.nativeElement.style.opacity = 0;

      this.bullets3.nativeElement.style.opacity = 0;

      this.image4.nativeElement.style.left = Math.floor(-this.adaptedImageWidth4) + (this.contentWidth - 19) + "px";
      this.image4.nativeElement.style.opacity = 0;

      this.bullets4.nativeElement.style.opacity = 0;

      this.image5.nativeElement.style.left = 0;
      this.image5.nativeElement.style.opacity = 0;

      this.bullets5.nativeElement.style.opacity = 0;

      this.image6.nativeElement.style.left = Math.floor(-this.adaptedImageWidth6) + (this.contentWidth - 19) + "px";
      this.image6.nativeElement.style.opacity = 0;

      clearTimeout(this.timeOut1);
      clearTimeout(this.timeOut2);
      clearTimeout(this.timeOut3);
      clearTimeout(this.timeOut4);
      clearTimeout(this.timeOut5);
      clearTimeout(this.timeOut6);
      clearTimeout(this.timeOut7);
    }
  }

  ngOnChanges(changes: any) {
    if (changes.activePageNum) {
      // If page change to this page and container is active
      if (changes.activePageNum.currentValue === this.myPageNum) {
        if (this.myContainerIsActive) {

          this.ratio = this.contentHeight / this.image1.nativeElement.height;
          this.adaptedImageWidth = Math.floor(this.image1.nativeElement.width * this.ratio);

          this.ratio4 = this.contentHeight / this.image4.nativeElement.height;
          this.adaptedImageWidth4 = Math.floor(this.image4.nativeElement.width * this.ratio4);

          this.ratio5 = this.contentHeight / this.image5.nativeElement.height;
          this.adaptedImageWidth5 = Math.floor(this.image5.nativeElement.width * this.ratio5);

          this.ratio6 = this.contentHeight / this.image6.nativeElement.height;
          this.adaptedImageWidth6 = Math.floor(this.image6.nativeElement.width * this.ratio6);

          this.initialiseAnim();
        }
      } else {
        // Changed page. No longer on right page. Reset and stop animation.
        this.manageAnim(false);
      }
    }

    if (changes.myContainerIsActive) {
      // Changed panel. Reset and stop animation.
      if (changes.myContainerIsActive.currentValue === false) {
        this.manageAnim(false);
      }
    }

    if (changes.language) {
      this.language = changes.language.currentValue;
    }
  }

  manageAnim(animOn: boolean): void {
    this.animOn = animOn;
    if (animOn) {
      this.startAnim();
    } else {
      this.initialiseAnim();
    }
  }

  startAnim(): void {
    this.image1.nativeElement.style.transition = 'left 10s ease-in, opacity 2s ease-in';
    this.bullets1.nativeElement.style.transition = 'opacity 2s ease-in';
    this.image2.nativeElement.style.transition = 'left 10s ease-in, opacity 2s ease-in';
    this.bullets2.nativeElement.style.transition = 'opacity 2s ease-in';
    this.image3.nativeElement.style.transition = 'left 10s ease-in, opacity 2s ease-in';
    this.bullets3.nativeElement.style.transition = 'opacity 2s ease-in';
    this.image4.nativeElement.style.transition = 'left 10s ease-in, opacity 2s ease-in';
    this.bullets4.nativeElement.style.transition = 'opacity 2s ease-in';
    this.image5.nativeElement.style.transition = 'left 10s ease-in, opacity 2s ease-in';
    this.bullets5.nativeElement.style.transition = 'opacity 2s ease-in';
    this.image6.nativeElement.style.transition = 'left 10s ease-in, opacity 2s ease-in';

    this.image1.nativeElement.style.left = Math.floor(-this.adaptedImageWidth) + (this.contentWidth - 19) + "px";
    this.image1.nativeElement.style.opacity = 1;
    this.bullets1.nativeElement.style.opacity = 1;
    this.timeOut2 = setTimeout(() => {
      this.image2.nativeElement.style.left = 0;
      this.image2.nativeElement.style.opacity = 1;
      this.bullets2.nativeElement.style.opacity = 1;
    }, 9000);
    this.timeOut3 = setTimeout(() => {
      this.image3.nativeElement.style.left = Math.floor(-this.adaptedImageWidth) + (this.contentWidth - 19) + "px";
      this.image3.nativeElement.style.opacity = 1;
      this.bullets3.nativeElement.style.opacity = 1;
    }, 18000);
    this.timeOut4 = setTimeout(() => {
      this.image4.nativeElement.style.left = 0;
      this.image4.nativeElement.style.opacity = 1;
      this.bullets4.nativeElement.style.opacity = 1;
    }, 27000);
    this.timeOut5 = setTimeout(() => {
      this.image5.nativeElement.style.left = Math.floor(-this.adaptedImageWidth5) + (this.contentWidth - 19) + "px";
      this.image5.nativeElement.style.opacity = 1;
      this.bullets5.nativeElement.style.opacity = 1;
    }, 36000);
    this.timeOut6 = setTimeout(() => {
      this.image6.nativeElement.style.left = 0;
      this.image6.nativeElement.style.opacity = 1;
    }, 45000);
    this.timeOut7 = setTimeout(() => {
      this.manageAnim(false);
    }, 54000);
  }

}
