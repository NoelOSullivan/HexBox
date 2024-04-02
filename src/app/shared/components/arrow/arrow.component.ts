import { Component, ElementRef, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PageCounters } from '../../../store/page/page.state';
import { PageCounterModel } from '../../../store/page/page.model';
import { ActivePanelNumber } from '../../../store/hexagon/hexagon.state';
import { ActivePanelNumberModel } from '../../../store/hexagon/hexagon.model';

@Component({
  selector: 'app-arrow',
  standalone: true,
  imports: [],
  templateUrl: './arrow.component.html',
  styleUrl: './arrow.component.scss'
})
export class ArrowComponent {

  @ViewChild('ArrowBackLeft') arrowBackLeft!: ElementRef;
  @ViewChild('ArrowFrontLeft') arrowFrontLeft!: ElementRef;
  @ViewChild('ArrowBackRight') arrowBackRight!: ElementRef;
  @ViewChild('ArrowFrontRight') arrowFrontRight!: ElementRef;
  @Select(PageCounters) pageCounter$!: Observable<PageCounterModel>;
  @Select(ActivePanelNumber) activePanelNumber$!: Observable<ActivePanelNumberModel>;

  activePanelNumber!: number;
  pageCounters!: any;

  ngAfterViewInit(): void {

    this.activePanelNumber$.subscribe(newAPN => {
      this.activePanelNumber = newAPN.activePanelNumber.apn;
      if (this.pageCounters) {
        if (this.pageCounters.counters[this.activePanelNumber - 1] === 1) {
          this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "0.5");
          this.arrowFrontLeft.nativeElement.style.setProperty("filter", "none");
          this.arrowBackLeft.nativeElement.style.setProperty("opacity", "0.5");
          this.arrowBackLeft.nativeElement.style.setProperty("filter", "none");
          this.arrowFrontRight.nativeElement.style.setProperty("opacity", "1");
          this.arrowFrontRight.nativeElement.style.setProperty("filter", "drop-shadow(-4px -2px 0px white)");
          this.arrowBackRight.nativeElement.style.setProperty("opacity", "1");
          this.arrowBackRight.nativeElement.style.setProperty("filter", "drop-shadow(-1px -2px 0px white)");
        } else {
          // If last page of selected panel dim right arrow
          if (this.pageCounters.counters[this.activePanelNumber - 1] === this.pageCounters.totals[this.activePanelNumber - 1]) {
            this.arrowFrontRight.nativeElement.style.setProperty("opacity", "0.5");
            this.arrowFrontRight.nativeElement.style.setProperty("filter", "none");
            this.arrowBackRight.nativeElement.style.setProperty("opacity", "0.5");
            this.arrowBackRight.nativeElement.style.setProperty("filter", "none");
            this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "1");
            this.arrowFrontLeft.nativeElement.style.setProperty("filter", "drop-shadow(-4px -2px 0px white)");
            this.arrowBackLeft.nativeElement.style.setProperty("opacity", "1");
            this.arrowBackLeft.nativeElement.style.setProperty("filter", "drop-shadow(-1px -2px 0px white)");
          } else {
            // Otherwise shine both arrows
            this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "1");
            this.arrowFrontLeft.nativeElement.style.setProperty("filter", "drop-shadow(-4px -2px 0px white)");
            this.arrowBackLeft.nativeElement.style.setProperty("opacity", "1");
            this.arrowBackLeft.nativeElement.style.setProperty("filter", "drop-shadow(-1px -2px 0px white)");
            this.arrowFrontRight.nativeElement.style.setProperty("opacity", "1");
            this.arrowFrontRight.nativeElement.style.setProperty("filter", "drop-shadow(-4px -2px 0px white)");
            this.arrowBackRight.nativeElement.style.setProperty("opacity", "1");
            this.arrowBackRight.nativeElement.style.setProperty("filter", "drop-shadow(-1px -2px 0px white)");
          }
        }
      }
      


    });

    // Subscribes to store array which gives active (front-facing) page for each panel
    this.pageCounter$.subscribe(newPC => {
      // If first page of selected panel dim left arrow
      this.pageCounters = newPC.pageCounters;
      if (newPC.pageCounters.counters[this.activePanelNumber - 1] === 1) {
        this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "0.5");
        this.arrowFrontLeft.nativeElement.style.setProperty("filter", "none");
        this.arrowBackLeft.nativeElement.style.setProperty("opacity", "0.5");
        this.arrowBackLeft.nativeElement.style.setProperty("filter", "none");
        this.arrowFrontRight.nativeElement.style.setProperty("opacity", "1");
        this.arrowFrontRight.nativeElement.style.setProperty("filter", "drop-shadow(-4px -2px 0px white)");
        this.arrowBackRight.nativeElement.style.setProperty("opacity", "1");
        this.arrowBackRight.nativeElement.style.setProperty("filter", "drop-shadow(-1px -2px 0px white)");
      } else {
        // If last page of selected panel dim right arrow
        if (newPC.pageCounters.counters[this.activePanelNumber - 1] === newPC.pageCounters.totals[this.activePanelNumber - 1]) {
          this.arrowFrontRight.nativeElement.style.setProperty("opacity", "0.5");
          this.arrowFrontRight.nativeElement.style.setProperty("filter", "none");
          this.arrowBackRight.nativeElement.style.setProperty("opacity", "0.5");
          this.arrowBackRight.nativeElement.style.setProperty("filter", "none");
          this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "1");
          this.arrowFrontLeft.nativeElement.style.setProperty("filter", "drop-shadow(-4px -2px 0px white)");
          this.arrowBackLeft.nativeElement.style.setProperty("opacity", "1");
          this.arrowBackLeft.nativeElement.style.setProperty("filter", "drop-shadow(-1px -2px 0px white)");
        } else {
          // Otherwise shine both arrows
          this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "1");
          this.arrowFrontLeft.nativeElement.style.setProperty("filter", "drop-shadow(-4px -2px 0px white)");
          this.arrowBackLeft.nativeElement.style.setProperty("opacity", "1");
          this.arrowBackLeft.nativeElement.style.setProperty("filter", "drop-shadow(-1px -2px 0px white)");
          this.arrowFrontRight.nativeElement.style.setProperty("opacity", "1");
          this.arrowFrontRight.nativeElement.style.setProperty("filter", "drop-shadow(-4px -2px 0px white)");
          this.arrowBackRight.nativeElement.style.setProperty("opacity", "1");
          this.arrowBackRight.nativeElement.style.setProperty("filter", "drop-shadow(-1px -2px 0px white)");
        }
      }

    });
  }

  clickRightArrow() {

  }

  clickLeftArrow() {

  }

}