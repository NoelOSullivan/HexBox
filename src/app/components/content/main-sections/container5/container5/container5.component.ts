import { Component } from '@angular/core';
import { SwipeDirective } from '../../../../../shared/directives/swipe.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-container5',
  standalone: true, 
  imports: [NgIf, SwipeDirective],
  templateUrl: './container5.component.html',
  styleUrls: ['./container5.component.scss','../../main-sections-shared-styles.scss']
})
export class Container5  {

  constructor() { }

}
