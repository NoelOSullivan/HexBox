import { Component } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { Store } from '@ngxs/store';

import { LinkIconComponent } from '../../../../../shared/components/link-icon/link-icon.component';
import { AirbusComponent } from './airbus/airbus.component';
import { DirectAccess } from '../../../../../shared/interfaces/panel';
import { AccessPanelDirect } from '../../../../../store/panel/panel.action';

@Component({
  selector: 'app-container2',
  standalone: true, 
  imports: [NgIf, ContentDirective, LinkIconComponent, AirbusComponent],
  templateUrl: './container2.component.html',
  styleUrls: ['./container2.component.scss','../../main-sections-shared-styles.scss']
})
export class Container2  {

  constructor(private store: Store) { }

  activePanel!: number;
  pageNum!: number;

  changePanel(panel: number) {
    console.log("changePanel", panel);
    this.activePanel = panel;
  }

  changePageNum(pageNum: number) {
    console.log("changePageNum", pageNum);
    this.pageNum = pageNum;
  }

  goPage(pageNum: number) {
    console.log("GO PAGE");
    const directAccess: DirectAccess = {hexNum: this.activePanel, nPage: pageNum};
    this.store.dispatch(new AccessPanelDirect(directAccess));
  }

}
