import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tarantula',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tarantula.component.html',
  styleUrl: './tarantula.component.scss'
})
export class TarantulaComponent {
  
  @Input() tarantulaIsOut!: boolean;
  @Input() tarantulaIsMoving!: boolean;

  // tarantulaIsOut: boolean = false;

}
