import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Store } from '@ngxs/store';
import { AddEggDomRect } from 'app/store/general/general.actions';
import { EggInfo } from 'app/shared/interfaces/general';

@Component({
  selector: 'app-headshot',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './headshot.component.html',
  styleUrl: './headshot.component.scss'
})
export class HeadshotComponent {

  @Output() switchHeads = new EventEmitter();

  @ViewChild('egg') egg!: ElementRef;
  @ViewChild('head') head!: ElementRef;
  @ViewChild('hoopHolder') hoopHolder!: ElementRef;

  @Input() headSrc!: string;
  @Input() nHead!: number;
  @Input() eggInfo!: EggInfo;
  @Input() headUp!: boolean;
  @Input() left!: string;
  @Input() right!: string;

  showEgg: boolean = false;
  timeCounter: any;

  constructor(private store: Store) { }

  ngAfterViewInit() {
    let elements = document.querySelectorAll('.head-holder');
    // Add only info from this head to the targets in the store

    if(this.left) {
      this.hoopHolder.nativeElement.style.left = this.left;
      this.store.dispatch(new AddEggDomRect(elements[this.nHead - 1].getBoundingClientRect()));
    }
    if(this.right) {
      this.hoopHolder.nativeElement.style.right = this.right;
      this.store.dispatch(new AddEggDomRect(elements[this.nHead - 1].getBoundingClientRect()));
    }
  }

  ngOnChanges(changes: any) {

    if (changes.headSrc) {
      this.headSrc = changes.headSrc.currentValue;
      clearTimeout(this.timeCounter);
      this.timeCounter = null;
      this.timeCounter = setTimeout(() => {
        this.switchHeads.emit();
      }, 10000);
    }

    if (changes.eggInfo) {
      this.eggInfo = changes.eggInfo.currentValue;
      if (this.nHead === this.eggInfo.targetHit) {
        this.showEgg = true;
        // Let the cycle finish and show the egg before positioning the egg
        setTimeout(() => {
          this.egg.nativeElement.style.left = this.eggInfo.percentLeft - 10 + "%";
          this.egg.nativeElement.style.top = this.eggInfo.percentTop - 20 + "%";
          clearTimeout(this.timeCounter);
          this.timeCounter = null;
        }, 0);
      } else {
        // The head is hidden and eggInfo set to 0. This will hide all eggs even though only one is visible
        if (this.eggInfo.targetHit === 0) {
          this.showEgg = false;
        }
      }
    }

    // if (changes.left) {
    //   console.log("changes.left.currentValue", changes.left.currentValue);
    //   if (this.hoopHolder) {
    //     this.hoopHolder.nativeElement.style.left = changes.left.currentValue;
    //   }
    // }

    // if (changes.right) {
    //   console.log("changes.right.currentValue", changes.right.currentValue);
    //   if (this.hoopHolder) {
    //     this.hoopHolder.nativeElement.style.left = changes.right.currentValue;
    //   }
    // }

  }

  ngOnDestroy(): void {
    clearTimeout(this.timeCounter);
  }

}
