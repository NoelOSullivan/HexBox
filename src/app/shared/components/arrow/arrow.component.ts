import { Component, ElementRef, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NgClass } from '@angular/common';

import { PageCounters } from '../../../store/page/page.state';
import { PageCounterModel } from '../../../store/page/page.model';
import { ActivePanelNumber } from '../../../store/hexagon/hexagon.state';
import { ActivePanelNumberModel } from '../../../store/hexagon/hexagon.model';

@Component({
  selector: 'app-arrow',
  standalone: true,
  imports: [NgClass],
  templateUrl: './arrow.component.html',
  styleUrl: './arrow.component.scss'
})

export class ArrowComponent {

  @Select(PageCounters) pageCounter$!: Observable<PageCounterModel>;
  @Select(ActivePanelNumber) activePanelNumber$!: Observable<ActivePanelNumberModel>;

  activePanelNumber!: number;
  pageCounters!: any;
  leftArrowActive: boolean = false;
  rightArrowActive: boolean = true;

  ngAfterViewInit(): void {

    this.activePanelNumber$.subscribe(newAPN => {
      this.activePanelNumber = newAPN.activePanelNumber.apn;
      if(this.activePanelNumber === 0) this.activePanelNumber = 6;
      if (this.pageCounters) {
        if (this.pageCounters.counters[this.activePanelNumber - 1] === 1) {
          this.leftArrowActive = false;
          this.rightArrowActive = true;
        } else {
          // If last page of selected panel dim right arrow
          if (this.pageCounters.counters[this.activePanelNumber - 1] === this.pageCounters.totals[this.activePanelNumber - 1]) {
            this.leftArrowActive = true;
            this.rightArrowActive = false;
          } else {
            // Otherwise shine both arrows
            this.leftArrowActive = true;
            this.rightArrowActive = true;
          }
        }
      }
    });

    // Subscribes to store array which gives active (front-facing) page for each panel
    this.pageCounter$.subscribe(newPC => {
      // If first page of selected panel dim left arrow
      this.pageCounters = newPC.pageCounters;
      if (newPC.pageCounters.counters[this.activePanelNumber - 1] === 1) {
        this.leftArrowActive = false;
        this.rightArrowActive = true;
      } else {
        // If last page of selected panel dim right arrow
        if (newPC.pageCounters.counters[this.activePanelNumber - 1] === newPC.pageCounters.totals[this.activePanelNumber - 1]) {
          this.leftArrowActive = true;
          this.rightArrowActive = false;
        } else {
          // Otherwise shine both arrows
          this.leftArrowActive = true;
          this.rightArrowActive = true;
        }
      }

    });
  }

  clickRightArrow() {

  }

  clickLeftArrow() {

  }

}