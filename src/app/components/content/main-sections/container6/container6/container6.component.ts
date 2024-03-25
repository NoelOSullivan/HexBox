import { Component } from '@angular/core';
import { SwipeDirective } from '../../../../../shared/directives/swipe.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-container6',
  standalone: true, 
  imports: [NgIf, SwipeDirective],
  templateUrl: './container6.component.html',
  styleUrls: ['./container6.component.scss','../../main-sections-shared-styles.scss']
})
export class Container6  {

  constructor() { }

}
