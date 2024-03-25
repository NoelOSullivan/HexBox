import { Component } from '@angular/core';
import { SwipeDirective } from '../../../../../shared/directives/swipe.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-container2',
  standalone: true, 
  imports: [NgIf, SwipeDirective],
  templateUrl: './container2.component.html',
  styleUrls: ['./container2.component.scss','../../main-sections-shared-styles.scss']
})
export class Container2  {

  constructor() { }

}
