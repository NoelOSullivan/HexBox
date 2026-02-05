import { Component, ElementRef, Input, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-zoom-detail',
    imports: [NgClass],
    templateUrl: './zoom-detail.component.html',
    styleUrl: './zoom-detail.component.scss'
})
export class ZoomDetailComponent {

  readonly zoomed = viewChild.required<ElementRef>('zoomed');
  readonly fire = viewChild.required<ElementRef>('fire');

  @Input() zoomImage!: string | undefined;
  @Input() zoomVisible!: boolean;
  @Input() percentLeft!: number;
  @Input() percentTop!: number;
  @Input() elementOnFire!: boolean;

  lightItUp: boolean = false;

  ngOnChanges(changes: any): void {
    const zoomed = this.zoomed();
    if (changes.percentLeft && changes.percentLeft.currentValue) {
      zoomed.nativeElement.style.left = (400 - 200) / 100 * -Math.round(changes.percentLeft.currentValue) + "px";
    }
    if (changes.percentTop && changes.percentTop.currentValue) {
      zoomed.nativeElement.style.top = (400 - 200) / 100 * -Math.round(changes.percentTop.currentValue) + "px";
    }

    if (changes.elementOnFire) {
      this.lightItUp = changes.elementOnFire.currentValue;
      const fire = this.fire();
      if (fire) {
        if (this.lightItUp === true) {
          fire.nativeElement.style.transition = "opacity 2s linear";
        } else {
          fire.nativeElement.style.transition = "none";
        }
      }
    }
  }

}
