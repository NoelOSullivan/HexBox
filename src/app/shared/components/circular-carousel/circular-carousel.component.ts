import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, viewChild } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { DataService } from 'app/shared/services/data.service';
import { Select } from '@ngxs/store';
import { AppState } from 'app/store/general/general.state';
import { Observable } from 'rxjs';
import { AppStateModel, LanguageModel } from 'app/store/general/general.model';
import { Language } from 'app/store/general/general.state';
import { SwipeIconComponent } from '../swipe-icon/swipe-icon.component';

@Component({
  selector: 'app-circular-carousel',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, SwipeIconComponent],
  providers: [DataService],
  templateUrl: './circular-carousel.component.html',
  styleUrl: './circular-carousel.component.scss'
})
export class CircularCarouselComponent implements OnInit {

  @Input() activePageNum!: number;
  @Input() data!: string;
  @Input() orientation!: string;
  @Input() perspective!: string;
  @Input() scrollType!: string;
  @Input() itemType!: string;
  @Input() language!: string;
  @Input() myPageNum!: number;
  @Input() myContainerIsActive!: boolean;

  @Output() carouselItemClicked = new EventEmitter<number>();

  @ViewChild('carouselRoot') carouselRoot!: ElementRef;
  @ViewChild('carousel') carousel!: ElementRef;

  @Select(AppState) appState$!: Observable<AppStateModel>;

  items!: any;

  private itemCount!: number;
  private itemHeight!: number;
  private itemDegrees!: number;

  private radius!: number;
  // private index!: number;
  // private touchEndY!: number;
  private lastY!: number;
  private degrees!: number;
  private isTouchOrMousedown: boolean = false;
  private itemCollection!: HTMLCollectionOf<HTMLElement>;
  private intervalID: any;
  private activeItem: number = 0;
  public captionTitle: string = "";
  public captionText: string = "";
  private lastActivePageNumber: number | undefined;
  private contentHeight!: number;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // this.appState$.subscribe(() => {
    //   if (this.isTouchOrMousedown) {
    //     this.isTouchOrMousedown = false;
    //   } 
    // });

    this.appState$.subscribe((appState) => {
      if (appState.contentHeight !== this.contentHeight) {
        this.contentHeight = appState.contentHeight;
        this.itemHeight = Math.floor(this.contentHeight * .45);
      }
    });
  }

  ngOnChanges(changes: any) {

    if (changes.activePageNum) {
      if (changes.activePageNum.currentValue === this.myPageNum) {
        // Condition stops carousel restart if user flips just a little before releasing and the flip comes back
        if (this.lastActivePageNumber !== this.myPageNum) {
          this.lastActivePageNumber = this.myPageNum;
          this.startAutoScroll();
        }
      } else {
        this.lastActivePageNumber = undefined;
        this.activeItem = 0;
        this.stopAutoScroll();
      }
    }

    if (changes.myContainerIsActive) {
      if (!this.myContainerIsActive) {
        this.lastActivePageNumber = undefined;
        this.activeItem = 0;
        if (this.scrollType === 'auto') {
          this.stopAutoScroll();
        }
      } else {
        // this.lastActivePageNumber = this.myPageNum;
        if(this.myPageNum === this.activePageNum) {
          if (this.scrollType === 'auto') {
            this.startAutoScroll();
          }
        }
      }
    }

    if (changes.language && this.itemType==='image') {
      this.language = changes.language.currentValue;
      if(this.items) {
        this.manageCaption();
      }
    }


  }

  ngAfterViewInit() {
    this.dataService.getData(this.data).subscribe((carouselData: any) => {
      this.items = carouselData.carousel.items;
      this.captionTitle = carouselData.carousel.captionTitleFr;
      this.captionText = carouselData.carousel.items[this.activeItem].captionFr;
      this.initCarousel();
    });
  }

  initCarousel() {
    setTimeout(() => {
      this.carouselRoot.nativeElement.style.perspective = this.perspective;
      this.itemCollection = this.carousel.nativeElement.children;
      this.itemCount = this.items.length;
      this.itemDegrees = 360 / this.itemCount;
      this.degrees = 0;

      for (let i = 0, length = this.itemCollection.length; i < length; i++) {
        const item = this.itemCollection.namedItem("item" + i);
        item!.style.height = this.itemHeight + "px";
      }
      this.radius = Math.round((this.itemHeight! / 2 / Math.tan(Math.PI / this.itemCount)));
      this.carousel.nativeElement.style.transform = 'translateZ(' + -this.radius + 'px) ' + 'rotateX' + '(' + (this.degrees) + 'deg)';

      for (let i = 0, length = this.itemCollection.length; i < length; i++) {
        const item = this.itemCollection.namedItem("item" + i);
        let itemAngle = this.itemDegrees * i * -1;
        item!.style.transform = 'rotateX' + '(' + itemAngle + 'deg) translateZ(' + this.radius + 'px)';
      }
      this.manageShadow();

    }, 0);
  }

  startAutoScroll(): void {
    if (this.scrollType === 'auto') {
      this.manageCaption();
      this.intervalID = setInterval(() => {
        this.autoRotateCarousel();
      }, 5000);
    }
  }

  stopAutoScroll(): void {
    if (this.scrollType === 'auto') {
      this.degrees = 0;
      this.rotateCarousel();
      clearInterval(this.intervalID);
    }
  }

  @HostListener('wheel', ['$event']) wheel(event: WheelEvent) {
    event.stopPropagation();
    if (this.scrollType === "manual") {
      if (event.deltaY > 0) {
        this.degrees -= this.itemDegrees / 5;
      } else {
        this.degrees += this.itemDegrees / 5;
      }
      this.degreesReference();
      this.rotateCarousel();
    }
  }

  @HostListener('touchstart', ['$event']) touchstart(event: TouchEvent) {
    if (this.scrollType === "manual") {
      event.stopPropagation();
      this.manageDown(event.changedTouches[0].clientY);
    }
  }

  @HostListener('touchmove', ['$event']) touchmove(event: TouchEvent) {
    if (this.scrollType === "manual") {
      event.stopPropagation();
      this.manageMove(event.targetTouches[0].clientY);
    }
  }

  @HostListener('touchend', ['$event']) touchend(event: TouchEvent) {
    if (this.scrollType === "manual") {
      event.stopPropagation();
      this.manageUp();
    }
  }

  @HostListener('mousedown', ['$event']) mousedown(event: MouseEvent) {
    if (this.scrollType === "manual") {
      event.stopPropagation();
      this.manageDown(event.clientY);
    }
  }

  @HostListener('mousemove', ['$event']) mousemove(event: MouseEvent) {
    if (this.scrollType === "manual") {
      event.stopPropagation();
      this.manageMove(event.clientY);
    }
  }

  @HostListener('mouseup', ['$event']) mouseup(event: MouseEvent) {
    if (this.scrollType === "manual") {
      event.stopPropagation();
      this.manageUp();
    }
  }

  manageDown(posY: number): void {
    this.isTouchOrMousedown = true;
    this.lastY = posY;
  }

  manageMove(posY: number): void {
    if (this.isTouchOrMousedown) {
      const diffY = this.lastY - posY;
      this.lastY = posY;
      this.degrees += diffY;
      this.degreesReference();
      this.rotateCarousel();
    }
  }

  degreesReference(): void {
    if (this.degrees >= 360) {
      this.degrees -= 360;
    } else {
      if (this.degrees < 0) {
        this.degrees = 360 + this.degrees;
      }
    }
  }

  manageUp(): void {
    this.isTouchOrMousedown = false;
    // this.carousel.nativeElement.style.transform = 'translateZ(' + -this.radius + 'px) ' + 'rotateX' + '(' + (this.degrees) + 'deg)';
  }

  autoRotateCarousel(): void {
    this.activeItem += 1;
    if (this.activeItem === this.items.length) this.activeItem = 0;
    this.degrees += this.itemDegrees;
    this.manageCaption();
    this.rotateCarousel();
  }

  manageCaption(): void {
      this.captionText = this.language === "Fr" ? this.items[this.activeItem].captionFr : this.items[this.activeItem].captionEn;
  }

  rotateCarousel(): void {
    if (this.carousel) {
      this.carousel.nativeElement.style.transform = 'translateZ(' + -this.radius + 'px) ' + 'rotateX' + '(' + (this.degrees) + 'deg)';
      this.manageShadow();
    }
  }

  manageShadow(): void {
    if (this.itemCollection) {
      let itemIndex = (this.degrees / this.itemDegrees);
      for (let i = 0, length = this.itemCollection.length; i < length; i++) {
        let shadow = this.itemCollection[i].lastChild as HTMLElement;
        let abstractCoef = Math.abs(itemIndex - i);
        let opacity = 0.4;
        if (abstractCoef < 0.25 || abstractCoef > this.itemCount - 0.25) {
          opacity = 0;
        } else {
          if (abstractCoef < 0.5 || abstractCoef > this.itemCount - 0.5) {
            opacity = 0.1;
          } else {
            if (abstractCoef < 0.75 || abstractCoef > this.itemCount - 0.75) {
              opacity = 0.2;
            } else {
              if (abstractCoef < 1 || abstractCoef > this.itemCount - 1) {
                opacity = 0.3;
              }
            }
          }
        }
        shadow.style.opacity = opacity.toString();
      }
    }
  }

  itemClicked(event: MouseEvent, item: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.carouselItemClicked.emit(item.page);
  }

}
