import { Component } from '@angular/core';
import { SwipeDirective } from '../../../../../shared/directives/swipe.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-container4',
  standalone: true, 
  imports: [NgIf, SwipeDirective],
  templateUrl: './container4.component.html',
  styleUrls: ['./container4.component.scss','../../main-sections-shared-styles.scss']
})
export class Container4  {

  constructor() { }

}
