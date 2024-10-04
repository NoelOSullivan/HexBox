import { Component, Input } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { CircularCarouselComponent } from 'app/shared/components/circular-carousel/circular-carousel.component';

@Component({
  selector: 'app-container6',
  standalone: true, 
  imports: [NgIf, ContentDirective, LogoComponent, CircularCarouselComponent],
  templateUrl: './container6.component.html',
  styleUrls: ['./container6.component.scss','../../main-sections-shared-styles.scss']
})
export class Container6  {

  @Input() nContainer!: number;

  constructor() { }

}
