import { Component } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/flip.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-container5',
  standalone: true, 
  imports: [NgIf, ContentDirective],
  templateUrl: './container5.component.html',
  styleUrls: ['./container5.component.scss','../../main-sections-shared-styles.scss']
})
export class Container5  {

  constructor() { }

}
