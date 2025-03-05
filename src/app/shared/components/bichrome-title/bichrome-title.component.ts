import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-bichrome-title',
  standalone: true,
  imports: [NgIf],
  templateUrl: './bichrome-title.component.html',
  styleUrl: './bichrome-title.component.scss'
})
export class BichromeTitleComponent {

  @ViewChild('wordBottom') wordBottom!: ElementRef;
  @ViewChild('wordTop') wordTop!: ElementRef;

  @Input() text!: string;

  text1!: string;
  text2!: string;

  ngOnChanges(changes: any) {
    if (changes.text) {
      const text = changes.text.currentValue;
      this.text1 = "<span style='color:#d72b31'>" + text.slice(0, 1) + "</span>" + text.slice(1);
      this.text2 = text.slice(0, -1) + "<span style='color:#d72b31'>" + text.slice(-1) + "</span>"
    }
  }

  ngAfterViewInit(): void {
    if (this.wordTop) {
      this.wordTop.nativeElement.innerHTML = this.text1;
    }
    if (this.wordBottom) {
      this.wordBottom.nativeElement.innerHTML = this.text2;
    }
  }
}
