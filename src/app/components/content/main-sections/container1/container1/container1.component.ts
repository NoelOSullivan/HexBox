import { Component } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/flip.directive';
import { NgIf } from '@angular/common';
import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { ArrowComponent } from '../../../../../shared/components/arrow/arrow.component';

@Component({
  selector: 'app-container1',
  standalone: true, 
  imports: [NgIf, ContentDirective, LogoComponent, ArrowComponent],
  templateUrl: './container1.component.html',
  styleUrls: ['./container1.component.scss','../../main-sections-shared-styles.scss']
})
export class Container1  {

  constructor() { }

  yikes() {
    console.log("YIKES");
  }

}
