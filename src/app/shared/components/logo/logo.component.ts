import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  providers: [DataService],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent implements OnInit {

  private allMenus!: any;
  public menuContent: Array<any> = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getMenus();
  }

  getMenus() {
    this.dataService.getMenus().subscribe((res: any) => {
      this.allMenus = res;
      this.setUpMenu();
    });
  }

  setUpMenu() {
    this.menuContent = this.allMenus["logo"][0];
  }

}
