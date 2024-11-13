import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-swipe-icon',
  standalone: true,
  imports: [NgClass],
  templateUrl: './swipe-icon.component.html',
  styleUrl: './swipe-icon.component.scss'
})
export class SwipeIconComponent {

  @Input() direction!: string;

}
