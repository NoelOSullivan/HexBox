import { Component } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/flip.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-container3',
  standalone: true, 
  imports: [NgIf, ContentDirective],
  templateUrl: './container3.component.html',
  styleUrls: ['./container3.component.scss','../../main-sections-shared-styles.scss']
})
export class Container3  {

  constructor() { }

}
