import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { HeadshotComponent } from './headshot/headshot.component';
import { PlayButtonComponent } from 'app/shared/components/play-button/play-button.component';

@Component({
  selector: 'app-thesun',
  standalone: true,
  imports: [NgIf, HeadshotComponent, PlayButtonComponent],
  templateUrl: './thesun.component.html',
  styleUrl: './thesun.component.scss'
})
export class ThesunComponent implements OnInit {

  @Input() language!: string;
  playing: boolean = false;

  hoop1Src!: string;
  hoop2Src!: string;
  hoop3Src!: string;
  hoop4Src!: string;
  hoop5Src!: string;
  hoop6Src!: string;

  ngOnInit() {
    // this.hoop1Src = "assets/images/thesun/hidalgo.png";
    // this.hoop2Src = "assets/images/thesun/roussel.png";
    // this.hoop3Src = "assets/images/thesun/dupont-aignan.png";
    // this.hoop4Src = "assets/images/thesun/arthaud.png";
    // this.hoop5Src = "assets/images/thesun/jadot.png";
    // this.hoop6Src = "assets/images/thesun/lassalle.png";
    this.hoop1Src = "assets/images/thesun/lepen.png";
    this.hoop2Src = "assets/images/thesun/macron.png";
    this.hoop3Src = "assets/images/thesun/melenchon.png";
    this.hoop4Src = "assets/images/thesun/pecresse.png";
    this.hoop5Src = "assets/images/thesun/poutou.png";
    this.hoop6Src = "assets/images/thesun/roussel.png";
  }

  

  managePlay(playing: boolean): void {
    this.playing = playing;
  }

}
