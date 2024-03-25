import { Component, OnInit } from '@angular/core';
import { HexagonGroupComponent } from '../hexagon-group/hexagon-group.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HexagonGroupComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  constructor() {
  }
 
  ngOnInit() {
  }
  
}