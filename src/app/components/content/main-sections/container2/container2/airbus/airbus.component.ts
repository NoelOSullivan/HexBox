import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-airbus',
  standalone: true,
  imports: [ NgClass ],
  templateUrl: './airbus.component.html',
  styleUrl: './airbus.component.scss'
})
export class AirbusComponent {

  @Input() activePageNum!: number;

  anim:boolean = false;

  ngAfterViewInit() {
    // this.anim = true;
  }

  ngOnChanges(changes: any) {
    if(changes.activePageNum.currentValue === 1) {
      this.anim = true;
    } else {
      this.anim = false;
    }

  }

}
