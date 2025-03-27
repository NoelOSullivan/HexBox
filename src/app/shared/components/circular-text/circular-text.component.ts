import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-circular-text',
  standalone: true,
  imports: [NgClass],
  templateUrl: './circular-text.component.html',
  styleUrl: './circular-text.component.scss'
})
export class CircularTextComponent {

  @Input() text!: string;
  @Input() turn!: string;

  

}
