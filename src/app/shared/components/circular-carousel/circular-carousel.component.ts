import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, viewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { DataService } from 'app/shared/services/data.service';

@Component({
  selector: 'app-circular-carousel',
  standalone: true,
  imports: [NgFor],
  providers: [DataService],
  templateUrl: './circular-carousel.component.html',
  styleUrl: './circular-carousel.component.scss'
})
export class CircularCarouselComponent {

  @ViewChild('carousel') carousel!: ElementRef;

  @Input() data!: string;
  @Input() orientation!: string;
  items!: any;
  itemCount!: number;
  itemDegrees!: number;
  itemSize!: number;

  radius!: number;
  index!: number;

  touchStartTime!: number;
  touchEndTime!: number;
  touchStartY!: number;
  touchEndY!: number;
  lastY!: number;
  degrees!: number;



  constructor(private dataService: DataService) { }

  ngAfterViewInit() {
    this.dataService.getData(this.data).subscribe((carouselData: any) => {
      this.items = carouselData.carousel.items;
      console.log("this.items", this.items);
      this.initCarousel();
    });
  }

  initCarousel() {
    setTimeout(() => {
      const itemCollection: HTMLCollectionOf<HTMLElement> = this.carousel.nativeElement.children;
      console.log("itemCollection", itemCollection);

      this.itemCount = this.items.length;
      this.itemDegrees = 360 / this.itemCount;
      this.degrees = this.itemDegrees;
      this.itemSize = this.orientation === 'vertical' ? this.carousel.nativeElement.offsetHeight : this.carousel.nativeElement.offsetWidth;

      console.log("this.itemSize", this.itemSize);
      this.radius = 250; //Math.round((this.itemSize / 2) / Math.tan(Math.PI / this.itemCount));
      console.log("this.radius", this.radius);

      for (let i = 0, length = itemCollection.length; i < length; i++) {
        const item = itemCollection.namedItem("item" + i);
        let itemAngle = this.itemDegrees * i;
        item!.style.transform = 'rotateX' + '(' + itemAngle + 'deg) translateZ(' + this.radius + 'px)';
      }
    }, 0);

  }

  @HostListener('touchstart', ['$event']) touchstart(event: TouchEvent) {
    event.stopPropagation();
    this.lastY = this.touchStartY = event.changedTouches[0].clientY;
    this.touchStartTime = event.timeStamp;
  }

  @HostListener('touchmove', ['$event']) touchmove(event: TouchEvent) {
    
    console.log("CAROUSEL");
    const diffY = this.lastY - event.targetTouches[0].clientY;
    this.lastY = event.targetTouches[0].clientY;


    console.log("diffY", diffY);
    // If swiping right calculate new rotation if not yet minimum value (0)
    // TO DO : 3 is arbitary. Maybe find a rule.
    // if (diffY < 0) {
    //   // if (this.rotation.degrees < 0) {
    //   //   this.rotation.degrees -= diffX * 3;
    //   // }
    //   this.degrees -= diffY; 
      
    // } else {
    //   // If swiping left calculate new rotation if not yet maximum value (this.maxRotation)
    //   // if (diffX > 0) {
    //   //   if (this.rotation.degrees > this.maxRotation) {
    //   //     this.rotation.degrees -= diffX * 3;
    //   //   }
    //   // }
    //   this.degrees += diffY; 
    // }
    
    // this.degrees += diffY * 3; 
    this.degrees += diffY / 2; 

    
      event.stopPropagation();

    this.rotateCarousel();
  }

  @HostListener('touchend', ['$event']) touchend(event: TouchEvent) {
    event.stopPropagation();
    this.carousel.nativeElement.style.transform = 'translateZ(' + -this.radius + 'px) ' + 'rotateX' + '(' + (this.degrees - 45) + 'deg)';
  }

  rotateCarousel(): void {
    console.log("this.degrees", this.degrees);
    this.carousel.nativeElement.style.transform = 'translateZ(' + -this.radius + 'px) ' + 'rotateX' + '(' + (this.degrees - 45) + 'deg)';
  

  }

}
