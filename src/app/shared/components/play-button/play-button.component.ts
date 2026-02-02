import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { AppState } from 'app/store/general/general.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppStateModel } from 'app/store/general/general.model';

@Component({
    selector: 'app-play-button',
    imports: [NgClass],
    templateUrl: './play-button.component.html',
    styleUrls: ['./play-button.component.scss']
})

export class PlayButtonComponent {

  @Output() playState = new EventEmitter<boolean>();
  @Input() playing!: boolean;
  @Select(AppState) appState$!: Observable<AppStateModel>;

  private blockAll!: boolean;

  constructor() { }

  language!: String;

  ngOnInit(): void {
    this.appState$.subscribe((appState) => {
      if (appState.blockAll !== this.blockAll) {
        this.blockAll = appState.blockAll;
      }
    });
  }

  ngOnChanges(changes: any) {
    if (changes.playing) {
      // console.log("changes.playing", changes.playing);
      this.playing = changes.playing.currentValue;
    }
  }

  clickPlay() {
    if (!this.blockAll) {
      this.playState.emit(true);
    }
  }

  clickStop() {
    if (!this.blockAll) {
      this.playState.emit(false);
    }
  }

}