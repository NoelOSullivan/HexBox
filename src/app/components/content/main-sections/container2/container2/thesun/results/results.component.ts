import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import * as d3 from 'd3';
import { HeadInfo } from 'app/shared/interfaces/general';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [NgFor],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})

export class ResultsComponent {

  @ViewChild('graph') graph!: ElementRef;

  @Input() headInfos!: Array<HeadInfo>
  // @Input() headFileNames!: Array<string>;

  graphWidth!: number;

  // [25,20,15,10,5,0,-5,-10,-15,-20,-25,-30]

  ngOnChanges(changes: any) {
    if (changes.headInfos) {
      console.log("RESULTS COMPONENT", changes.headInfos);
    }
  }

  ngAfterViewInit() {
    this.graphWidth = this.graph.nativeElement.clientWidth;
    this.createGraph();
  }

  createGraph(): void {

    let results = this.headInfos.map(a => a.result);

    console.log("results", results);
    

    let min = Math.min(...results);
    if(min > 0) min = 0;
    let max = Math.max(...results);
    if(max < 0) max = 0;
    let range = max - min;

    console.log("this.graphWidth", this.graphWidth);
    console.log("RANGE", range);

    let centrePercent = Math.floor(Math.abs(min) / range * 100);
    console.log("CENTRE PC", centrePercent);

    let itemCollection = this.graph.nativeElement.children;
    for (let i = 0, length = itemCollection.length; i < length; i++) {
      const bar = itemCollection.namedItem("bar" + i);
      console.log("bar", results[i]);

      bar.style.backgroundImage = "url('" + this.headInfos[i].imageSrc + "')";
      bar.style.backgroundPosition = "center center";
      bar.style.backgroundSize = "200px 200px";
      bar.style.backgroundRepeat = "no-repeat"
      
      if (results[i] < 0) {
        bar.style.right = (100 - centrePercent) + "%";
        // bar.children[0].style.right = -(100 - centrePercent) + "%";
        // bar.children[0].style.marginLeft = "100%";
          bar.children[0].style.left = "calc(100% + 10px)";
      } else {
        if (results[i] > 0) {
          bar.style.left = centrePercent + "%";
          bar.children[0].style.right = "calc(100% + 10px)";
        } else {
          bar.style.left = centrePercent + "%";
          bar.style.width = "2px";
          bar.children[0].style.left = "calc(100% + 10px)";
        }
      }
      bar.style.top = i * 30 + (i * 2) + "px";

      setTimeout(() => {
        let barPercent = Math.floor(Math.abs(results[i]) / range * 100);
        bar.style.width = barPercent + "%";
      },0);




    }


  }

}
