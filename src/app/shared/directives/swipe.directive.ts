import { Directive, ElementRef, HostListener } from '@angular/core';
import { Rotation } from '../interfaces/rotation';

@Directive({
  selector: '[appSwipe]',
  exportAs: 'AppSwipe',
  standalone: true
})

export class SwipeDirective {

  lastX!: number;
  rotation: Rotation = { degrees: 0 };
  nPages!: number;
  page: number = 1;
  maxRotation!: number;
  count: number = 0;

  constructor(private element: ElementRef) {}

  ngAfterViewInit( ) {
    
    this.nPages = this.element.nativeElement.children.length;
    this.maxRotation = (this.nPages - 1) * -180;


    for(let i = 2; i<this.nPages; i++) {
      this.element.nativeElement.children[i].style.display='none';
    }

  }

  @HostListener('touchstart', ['$event']) touchstart(event: TouchEvent) {

    this.lastX = event.targetTouches[0].clientX;

  }

  @HostListener('touchmove', ['$event']) touchmove(event: TouchEvent) {

    const diffX = this.lastX - event.targetTouches[0].clientX;
    this.lastX = event.targetTouches[0].clientX;
    this.rotation.degrees -= diffX;

    if(this.rotation.degrees > 0) this.rotation.degrees = 0;
    if(this.rotation.degrees < this.maxRotation) this.rotation.degrees = this.maxRotation;
    this.element.nativeElement.style.transform = "rotateY(" + this.rotation.degrees + "deg)";

    // console.log("DEG", this.rotation.degrees);
    if (this.count !== Math.floor(this.rotation.degrees / -180)) {
      // console.log("COUNT CHANGE", Math.floor(this.rotation.degrees / -180));
      this.count = Math.floor(this.rotation.degrees / -180);

      for(let i = 0; i<this.nPages; i++) {
        this.element.nativeElement.children[i].style.display='none';
      }
      this.element.nativeElement.children[this.count].style.display='flex';
      if(this.count < this.nPages - 1) {
        this.element.nativeElement.children[this.count + 1].style.display='flex';
      }

    }

    // switch (this.rotation.degrees ) {
    //   case
    // }
    
    

    // for(let i = 0; i<this.nPages; i++) {
    //   console.log("i",i);
    //   console.log("i",i);
    // }

    // 0    -  -180       1 2
    // -180 -  -360       2 3
    // -360 -  -540       3 4
    // -540 -  -720       4 5
    // -720 -  -900       5 6
    // -900 -  -1080      6 7
    // -1080 - -1260      7 8

  }

  @HostListener('touchend', ['$event']) touchend(event: TouchEvent) {
  }


}
