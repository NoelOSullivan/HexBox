import { Component } from '@angular/core';
import { SwipeDirective } from '../../../../../shared/directives/swipe.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-container1',
  standalone: true, 
  imports: [NgIf, SwipeDirective],
  templateUrl: './container1.component.html',
  styleUrls: ['./container1.component.scss','../../main-sections-shared-styles.scss']
})
export class Container1  {

  constructor() { }

}
