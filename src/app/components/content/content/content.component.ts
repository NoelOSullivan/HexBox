import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { Container1 } from '../main-sections/container1/container1/container1.component';
import { Container4 } from '../main-sections/container4/container4/container4.component';
import { Container2 } from '../main-sections/container2/container2/container2.component';
import { Container3 } from '../main-sections/container3/container3/container3.component';
import { Container5 } from '../main-sections/container5/container5/container5.component';
import { Container6 } from '../main-sections/container6/container6/container6.component';
import { Observable } from 'rxjs';
import { RotationToAdd } from '../../../store/hexagon/hexagon.state';
import { RotationToAddModel } from '../../../store/hexagon/hexagon.model';
import { Select } from '@ngxs/store';
import { ArrowComponent } from '../../../shared/components/arrow/arrow.component';

@Component({
  selector: 'app-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgIf, Container1, Container2, Container3, Container4, Container5, Container6, ArrowComponent],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})

export class ContentComponent implements OnInit {

  @ViewChild('contentHolder') contentHolder!: ElementRef;
  @Input() startRotation!: number;
  @Input() nContainer!: number;

  actualRotation: number = 0;
  transitionSet: boolean = false;

  @Select(RotationToAdd) rotation$!: Observable<RotationToAddModel>;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.actualRotation = this.startRotation;
  }

  ngAfterViewInit(): void {
    this.rotation$.subscribe(newRot => {
      if (!this.transitionSet && newRot.rotationToAdd.degrees != 0) {
        this.transitionSet = true;
        this.contentHolder.nativeElement.style.transition = "transform 1s";
      }
      this.rotateMe(Number(newRot.rotationToAdd.degrees));

    });
  }

  rotateMe(degrees: number) {
    this.actualRotation += degrees;
    this.contentHolder.nativeElement.style.transform = "rotate(" + this.actualRotation + "deg)";
  }

}