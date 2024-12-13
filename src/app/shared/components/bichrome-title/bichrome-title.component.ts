import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-bichrome-title',
  standalone: true,
  imports: [NgIf],
  templateUrl: './bichrome-title.component.html',
  styleUrl: './bichrome-title.component.scss'
})
export class BichromeTitleComponent {

  @Input() text!: string;

}
