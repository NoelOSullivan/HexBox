import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-headshot',
  standalone: true,
  imports: [],
  templateUrl: './headshot.component.html',
  styleUrl: './headshot.component.scss'
})
export class HeadshotComponent implements OnInit{
  @Input() headSrc!: string;

  ngOnInit(): void {
    console.log("this.headSrc", this.headSrc);
  }

  ngOnChanges(changes: any) {
    if(changes.headSrc.currentValue) {
      console.log("changes", changes.headSrc.currentValue);
      this.headSrc = changes.headSrc.currentValue;
    }
  }
}
