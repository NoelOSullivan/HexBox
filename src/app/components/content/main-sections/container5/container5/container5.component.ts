import { Component, Input } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { DirectAccessComponent } from '../../../../../shared/components/direct-access/direct-access.component';

@Component({
  selector: 'app-container5',
  standalone: true, 
  imports: [NgIf, ContentDirective, DirectAccessComponent],
  templateUrl: './container5.component.html',
  styleUrls: ['./container5.component.scss','../../main-sections-shared-styles.scss']
})
export class Container5  {

  @Input() nContainer!: number;

  constructor() { }

}
