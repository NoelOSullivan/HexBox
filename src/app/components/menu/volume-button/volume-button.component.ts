import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LanguageModel } from 'app/store/general/general.model';
import { Language } from 'app/store/general/general.state';
import { ChangeLanguage } from 'app/store/general/general.actions';

import { ChangeVolume } from 'app/store/general/general.actions';

@Component({
  selector: 'app-volume-button',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './volume-button.component.html',
  styleUrls: ['./volume-button.component.scss']
})
export class VolumeButtonComponent implements OnInit {

  // @Select(Language) language$!: Observable<LanguageModel>;

  @ViewChild('volumeCarousel') volumeCarousel!: ElementRef;
  @ViewChild('cogVolume1') cogVolume1!: ElementRef;
  @ViewChild('cogVolume2') cogVolume2!: ElementRef;

  constructor(private store: Store) { }

  volumeOpen: boolean = false;
  volume: number = 0;

  lastY!: number;
  actualY!: number;
  degrees: number = 0;
  direction: number = 0;

  intervalId: any;
  hToolsSound: any;

  ngOnInit() {
    this.hToolsSound = new Howl({ src: ['assets/audio/cogOK.mp3'], volume: this.volume, html5: true, autoplay: false, onend: () => { this.hToolsSound.unload(); } });
  }

  openVolume(event: TouchEvent): void {
    this.volumeOpen = true;
    this.lastY = event.changedTouches[0].clientY;
    if (this.volumeCarousel) {
      this.volumeCarousel.nativeElement.style.transform = 'rotateX' + '(' + (this.degrees) + 'deg)';
    }
  }

  mousemoveVolume(event: TouchEvent): void {
    if (this.volumeOpen && this.volumeCarousel) {
      this.actualY = event.changedTouches[0].clientY;
      let diff = this.lastY - this.actualY;
      if (diff < -5) {
        if (this.degrees < 160) {
          this.degrees += 40;
          this.volumeCarousel.nativeElement.style.transform = 'rotateX' + '(' + (this.degrees) + 'deg)';
          this.cogVolume1.nativeElement.style.transform = 'rotate' + '(' + (this.degrees / 2) + 'deg)';
          this.cogVolume2.nativeElement.style.transform = 'rotate' + '(' + (-this.degrees / 2) + 'deg)';
          this.hToolsSound.volume(this.degrees / 40 * 0.5 * 0.25);
          this.hToolsSound.play();
          setTimeout(() => {
            this.hToolsSound.stop();
          },300);
        }
        this.lastY = this.actualY;
      } else {
        if (diff > 5) {
          if (this.degrees > 0) {
            this.degrees -= 40;
            this.volumeCarousel.nativeElement.style.transform = 'rotateX' + '(' + (this.degrees) + 'deg)';
            this.cogVolume1.nativeElement.style.transform = 'rotate' + '(' + (this.degrees / 2) + 'deg)';
            this.cogVolume2.nativeElement.style.transform = 'rotate' + '(' + (-this.degrees / 2) + 'deg)';
            this.hToolsSound.volume(this.degrees / 40 * 0.25);
            this.hToolsSound.play();
            setTimeout(() => {
              this.hToolsSound.stop();
            },300);
          }
          this.lastY = this.actualY;
        }
      }
    }
  }

  closeVolume(event: TouchEvent): void {
    clearInterval(this.intervalId)
    this.volumeOpen = false;
    this.volume = this.degrees / 40;
    this.store.dispatch(new ChangeVolume(this.volume * 0.25));
  }

}