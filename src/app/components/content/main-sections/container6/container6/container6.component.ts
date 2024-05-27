import { Component } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { LogoComponent } from '../../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-container6',
  standalone: true, 
  imports: [NgIf, ContentDirective, LogoComponent],
  templateUrl: './container6.component.html',
  styleUrls: ['./container6.component.scss','../../main-sections-shared-styles.scss']
})
export class Container6  {

  constructor() { }

}
