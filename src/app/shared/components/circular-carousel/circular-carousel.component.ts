import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, viewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { DataService } from 'app/shared/services/data.service';
import { Select } from '@ngxs/store';
import { AppState } from 'app/store/general/general.state';
import { Observable } from 'rxjs';
import { AppStateModel, LanguageModel } from 'app/store/general/general.model';
import { Language } from 'app/store/general/general.state';

@Component({
  selector: 'app-circular-carousel',
  standalone: true,
  imports: [NgFor, NgIf],
  providers: [DataService],
  templateUrl: './circular-carousel.component.html',
  styleUrl: './circular-carousel.component.scss'
})
export class CircularCarouselComponent implements OnInit {

  @Input() nContainer!: number;
  @Input() pageNum!: number;
  @Input() language!: string;
  @Output() carouselItemClicked = new EventEmitter<number>();

  @ViewChild('carouselRoot') carouselRoot!: ElementRef;
  @ViewChild('carousel') carousel!: ElementRef;

  @Select(AppState) appState$!: Observable<AppStateModel>;

  @Input() data!: string;
  @Input() orientation!: string;
  @Input() perspective!: string;
  @Input() itemHeightInput!: string;
  // @Input() activePanel!: number;
  // @Input() activePageNum!: number;
  items!: any;
  itemCount!: number;
  itemHeight!: number;
  itemDegrees!: number;

  radius!: number;
  index!: number;
  startY!: number;
  touchEndY!: number;
  lastY!: number;
  degrees!: number;
  isTouchOrMousedown: boolean = false;

  itemCollection!: HTMLCollectionOf<HTMLElement>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.appState$.subscribe(() => {
      if (this.isTouchOrMousedown) {
        this.isTouchOrMousedown = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataService.getData(this.data).subscribe((carouselData: any) => {
      this.items = carouselData.carousel.items;
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
        item!.style.height = this.itemHeightInput;
      }

      this.itemHeight = this.itemCollection.namedItem("item1")!.clientHeight;
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

  @HostListener('wheel', ['$event']) wheel(event: WheelEvent) {
    event.stopPropagation();
    if (event.deltaY > 0) {
      this.degrees -= this.itemDegrees / 5;
    } else {
      this.degrees += this.itemDegrees / 5;
    }
    this.degreesReference();
    this.rotateCarousel();
  }

  @HostListener('touchstart', ['$event']) touchstart(event: TouchEvent) {
    event.stopPropagation();
    this.manageDown(event.changedTouches[0].clientY);
  }

  @HostListener('touchmove', ['$event']) touchmove(event: TouchEvent) {
    event.stopPropagation();
      this.manageMove(event.targetTouches[0].clientY);
  }

  @HostListener('touchend', ['$event']) touchend(event: TouchEvent) {
    event.stopPropagation();
    this.manageUp();
  }

  @HostListener('mousedown', ['$event']) mousedown(event: MouseEvent) {
    event.stopPropagation();
    this.manageDown(event.clientY);
  }

  @HostListener('mousemove', ['$event']) mousemove(event: MouseEvent) {
    event.stopPropagation();
    this.manageMove(event.clientY);
  }

  @HostListener('mouseup', ['$event']) mouseup(event: MouseEvent) {
    event.stopPropagation();
    this.manageUp();
  }

  manageDown(posY: number): void {
    this.isTouchOrMousedown = true;
    this.lastY = this.startY = posY;
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
    if (this.degrees > 360) {
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

  rotateCarousel(): void {
    this.carousel.nativeElement.style.transform = 'translateZ(' + -this.radius + 'px) ' + 'rotateX' + '(' + (this.degrees) + 'deg)';
    this.manageShadow();
  }

  manageShadow() {
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

  itemClicked(event: MouseEvent, item: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.carouselItemClicked.emit(item.page);
  }

}
