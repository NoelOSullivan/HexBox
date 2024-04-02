import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, concat } from 'rxjs';
import { PageCounters } from '../../../store/page/page.state';
import { PageCounterModel } from '../../../store/page/page.model';
import { ActivePanelNumber } from '../../../store/hexagon/hexagon.state';
import { ActivePanelNumberModel } from '../../../store/hexagon/hexagon.model';
// import { ActivePanelNumber } from '../../interfaces/hexagon';

@Component({
  selector: 'app-arrow',
  standalone: true,
  imports: [],
  templateUrl: './arrow.component.html',
  styleUrl: './arrow.component.scss'
})
export class ArrowComponent {

  @ViewChild('ArrowFrontLeft') arrowFrontLeft!: ElementRef;
  @ViewChild('ArrowFrontRight') arrowFrontRight!: ElementRef;
  @Select(PageCounters) pageCounter$!: Observable<PageCounterModel>;
  @Select(ActivePanelNumber) activePanelNumber$!: Observable<ActivePanelNumberModel>;

  activePanelNumber!: number;
  pageCounters!: PageCounters;

  ngAfterViewInit(): void {

    // If page 1 of panel - left arrow dim / right arrow light
    // If page lastpage of panel - right arrow dim / left arrow light
    // else both arrows light

    this.activePanelNumber$.subscribe(newAPN => {
      this.activePanelNumber = newAPN.activePanelNumber.apn;
      // console.log("newAPN", newAPN);
    });

    this.pageCounter$.subscribe(newPC => {
      // console.log("newPC", newPC);

      if(newPC.pageCounters.counters[this.activePanelNumber - 1] === 1 ) {
        this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "0.5");
      } else {
        if(newPC.pageCounters.counters[this.activePanelNumber - 1] === newPC.pageCounters.totals[this.activePanelNumber - 1] ) {
          this.arrowFrontRight.nativeElement.style.setProperty("opacity", "0.5");
        } else {
          this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "1");
          this.arrowFrontRight.nativeElement.style.setProperty("opacity", "1");
        }
      }

    });

    // "hello" + number.ToString()

    // this.activePanelNumber$.subscribe(newPanelNumber => {
    //   console.log("newPanelNumber", newPanelNumber.activePanelNumber);
    //   // this.activePanelNumber = newPanelNumber.activePanelNumber;

    //   if (!newPanelNumber) {
    //     // this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "0.5");
    //   } else {
    //     // debugger;
    //     // conseole.log("this.pageCounters", this.pageCounters);
    //     // if (this.pageCounters[this.contentPanelNumber.panel - 1] === 1) {
    //     //   this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "0.5");
    //     // } else {
    //     //   this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "1");
    //     // }

    //     this.pageCounters$.subscribe(newPC => {
    //       // console.log("newPC", newPC);
    //       // debugger;
    //       // console.log("NEW PC", newPC.pageCounters.counters[this.contentPanelNumber.panel - 1]);
    //       // this.pageCounters = newPC.pageCounters.counters;
    //       // if (newPC.pageCounters[this.contentPanelNumber.panel - 1] === 1) {
    //       //   this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "0.5");
    //       // }
    //     });

    //   }
    // });

    // this.pageCounters$.subscribe(newPC => {
    //   // console.log("newPC", newPC);
    //   // debugger;
    //   // console.log("NEW PC", newPC.pageCounters.counters[this.contentPanelNumber.panel - 1]);
    //   // this.pageCounters = newPC.pageCounters;
    //   // if (newPC.pageCounters[this.contentPanelNumber.panel - 1] === 1) {
    //   //   this.arrowFrontLeft.nativeElement.style.setProperty("opacity", "0.5");
    //   // }
    // });


  }

  clickRightArrow() {

  }

  clickLeftArrow() {

  }

}
