import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-play-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.scss']
})

export class PlayButtonComponent {

  @Output() animState = new EventEmitter<boolean>();
  @Input() animOn!: boolean;

  constructor() { }

  language!: String;

  ngOnChanges(changes: any) {
    if (changes.animOn) {
      console.log("changes.animOn", changes.animOn);
      this.animOn = changes.animOn.currentValue;
    }
  }

  startAnim() {
    this.animState.emit(true);
  }

  stopAnim() {
    this.animState.emit(false);
  }

}