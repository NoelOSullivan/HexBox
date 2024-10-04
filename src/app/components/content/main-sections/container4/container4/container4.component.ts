import { Component, Input } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { DirectAccessComponent } from '../../../../../shared/components/direct-access/direct-access.component';

@Component({
  selector: 'app-container4',
  standalone: true, 
  imports: [NgIf, ContentDirective, DirectAccessComponent],
  templateUrl: './container4.component.html',
  styleUrls: ['./container4.component.scss','../../main-sections-shared-styles.scss']
})
export class Container4  {

  @Input() nContainer!: number;

  constructor() { }

}
