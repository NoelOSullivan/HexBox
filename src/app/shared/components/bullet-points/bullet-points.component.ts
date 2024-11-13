import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-bullet-points',
  standalone: true,
  imports: [ NgFor ],
  templateUrl: './bullet-points.component.html',
  styleUrl: './bullet-points.component.scss'
})
export class BulletPointsComponent {

  // bulletPoints!: 

}
