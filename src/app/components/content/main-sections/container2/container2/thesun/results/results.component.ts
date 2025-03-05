import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import * as d3 from 'd3';
import { HeadInfo } from 'app/shared/interfaces/general';
import { AppState } from 'app/store/general/general.state';
import { AppStateModel } from 'app/store/general/general.model';
import { Observable } from 'rxjs/internal/Observable';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [NgFor],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})

export class ResultsComponent {

  @Select(AppState) appState$!: Observable<AppStateModel>;

  @ViewChild('graph') graph!: ElementRef;

  @Input() headInfos!: Array<HeadInfo>

  graphWidth!: number;
  contentHeight!: number;

  ngOnInit():void {
    this.appState$.subscribe((appState) => {
      if (appState.contentHeight !== this.contentHeight) {
        this.contentHeight = appState.contentHeight;
      }
    });
  }

  ngAfterViewInit() {
    this.graphWidth = this.graph.nativeElement.clientWidth;
    this.createGraph();
  }

  createGraph(): void {
    // Make a results array using the headInfos result key
    let results = this.headInfos.map(a => a.result);

    // Find the centre of the range of results to position the graph centre
    let min = Math.min(...results);
    if (min > 0) min = 0;
    let max = Math.max(...results);
    if (max < 0) max = 0;
    let range = max - min;
    let centrePercent = Math.floor(Math.abs(min) / range * 100);

    let itemCollection = this.graph.nativeElement.children;
    let barHeight = Math.floor((this.contentHeight - 60) / itemCollection.length);
    for (let i = 0, length = itemCollection.length; i < length; i++) {
      const bar = itemCollection.namedItem("bar" + i);
      // Add corresponding head as background image. Calculated to show the eyes.
      bar.style.backgroundImage = "url('" + this.headInfos[i].imageSrc + "')";
      bar.style.backgroundPosition = "center center";
      bar.style.backgroundSize = "200px 200px";
      bar.style.backgroundRepeat = "no-repeat"

      if (results[i] < 0) {
        // Negative result. Bar justified right.
        bar.style.right = (100 - centrePercent) + "%";
        // Positive result. Name text on right of graph centre. Unless graph centre is too far right.
        if (centrePercent < 65) {
          bar.children[0].style.left = "calc(100% + 10px)";
        } else {
          bar.children[0].style.right = "10px";
        }
      } else {
        if (results[i] > 0) {
          // Positive result. Bar justified left.
          bar.style.left = centrePercent + "%";
          // Positive result. Name text on left of graph centre. Unless graph centre is too far left.
          if (centrePercent > 35) {
            bar.children[0].style.right = "calc(100% + 10px)";
          } else {
            bar.children[0].style.left = "10px";
          }
        } else {
          // Score of 0
          bar.style.left = centrePercent + "%";
          bar.style.width = "2px";
          bar.children[0].style.left = "calc(100% + 10px)";
        }
      }

      bar.style.height = barHeight + "px";
      bar.style.top = i * barHeight + (i * 2) + "px";

      // A 0 timeout allows the cycle to show the width as 0 before doing transition on width
      setTimeout(() => {
        let barPercent = Math.floor(Math.abs(results[i]) / range * 100);
        bar.style.width = barPercent + "%";
      }, 0);
    }
  }

}
