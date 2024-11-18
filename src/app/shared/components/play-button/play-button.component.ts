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

  @Output() playState = new EventEmitter<boolean>();
  @Input() playing!: boolean;

  constructor() { }

  language!: String;

  ngOnChanges(changes: any) {
    if (changes.playing) {
      console.log("changes.playing", changes.playing);
      this.playing = changes.playing.currentValue;
    }
  }

  clickPlay() {
    this.playState.emit(true);
  }

  clickStop() {
    this.playState.emit(false);
  }

}