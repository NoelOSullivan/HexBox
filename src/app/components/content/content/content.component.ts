import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { NgIf, NgClass } from '@angular/common';
import { Container1 } from '../main-sections/container1/container1/container1.component';
import { Container4 } from '../main-sections/container4/container4/container4.component';
import { Container2 } from '../main-sections/container2/container2/container2.component';
import { Container3 } from '../main-sections/container3/container3/container3.component';
import { Container5 } from '../main-sections/container5/container5/container5.component';
import { Container6 } from '../main-sections/container6/container6/container6.component';
import { ActivePanelNumber } from '../../../store/hexagon/hexagon.state';
import { PageCounters } from '../../../store/panel/panel.state';
import { RotationToAdd } from '../../../store/hexagon/hexagon.state';
import { ActivePanelNumberModel, RotationToAddModel } from '../../../store/hexagon/hexagon.model';
import { Select } from '@ngxs/store';
import { PageCounterModel } from '../../../store/panel/panel.model';
import { ChangeContentWidth } from 'app/store/general/general.actions';

@Component({
  selector: 'app-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgIf, NgClass, Container1, Container2, Container3, Container4, Container5, Container6],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})

export class ContentComponent implements OnInit {

  @ViewChild('contentHolder') contentHolder!: ElementRef;
  @ViewChild('pageWidget') pageWidget!: ElementRef;
  @Input() startRotation!: number;
  @Input() nContainer!: number;

  @Select(RotationToAdd) rotation$!: Observable<RotationToAddModel>;
  @Select(ActivePanelNumber) activePanelNumber$!: Observable<ActivePanelNumberModel>;
  @Select(PageCounters) pageCounters$!: Observable<PageCounterModel>

  actualRotation: number = 0;
  transitionSet: boolean = false;

  activePanelNumber!: number;
  pageCounters!: PageCounterModel;

  pageTotal: number = 0;
  pageNumber: number = 0;
  // contentHeight!: number;

  constructor(private store: Store) { }

  ngOnInit() {
    this.actualRotation = this.startRotation;

    this.pageCounters$.subscribe(newPC => {
      this.pageCounters = newPC;
      // console.log("pageCounters-----", this.pageCounters);
      this.updateWidgetInfo();
    });

    this.activePanelNumber$.subscribe(newAPN => {
      if (this.activePanelNumber !== newAPN.activePanelNumber.apn) {
        this.activePanelNumber = newAPN.activePanelNumber.apn;
        this.updateWidgetInfo();
      }
    });

    
    

  }

  updateWidgetInfo(): void {

    // console.log("this.activePanelNumber", this.activePanelNumber);

    let apn = this.activePanelNumber;
    if (apn === 0) apn = 6;
    this.pageTotal = this.pageCounters.pageCounters.totals[apn - 1];
    this.pageNumber = this.pageCounters.pageCounters.counters[apn - 1];

    // console.log("WIDGET", this.pageTotal, this.pageNumber);

    if (this.pageWidget) {
      // console.log(this.pageNumber / this.pageTotal * 100);
      this.pageWidget.nativeElement.style.width = this.pageNumber / this.pageTotal * 100 + '%';
    }
  }

  ngAfterViewInit(): void {
    this.rotation$.subscribe(newRot => {
      if (!this.transitionSet && newRot.rotationToAdd.degrees != 0) {
        this.transitionSet = true;
        this.contentHolder.nativeElement.style.transition = "transform 1s";
      }
      this.rotateMe(Number(newRot.rotationToAdd.degrees));
    });
    console.log("CW",this.contentHolder.nativeElement.clientWidth); 

    this.store.dispatch(new ChangeContentWidth(Math.min(this.contentHolder.nativeElement.clientWidth,400)));
    // this.pageWidgetInfo.pageTotal = this.pageCounters.pageCounters.totals[this.activePanelNumber - 1]

    // this.pageTotal = this.pageCounters.pageCounters.totals[this.activePanelNumber - 1];
    // this.pageNumber = this.pageCounters.pageCounters.counters[this.activePanelNumber - 1];

    // console.log("WIDGET", this.pageTotal, this.pageNumber);

  }

  rotateMe(degrees: number) {
    this.actualRotation += degrees;
    this.contentHolder.nativeElement.style.transform = "rotate(" + this.actualRotation + "deg)";
  }

}