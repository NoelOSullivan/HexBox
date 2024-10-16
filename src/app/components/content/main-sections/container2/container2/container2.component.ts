import { Component, Input } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { Select, Store } from '@ngxs/store';

import { LinkIconComponent } from '../../../../../shared/components/link-icon/link-icon.component';
import { AirbusComponent } from './airbus/airbus.component';
import { DirectAccess } from '../../../../../shared/interfaces/panel';
import { AccessPanelDirect } from '../../../../../store/panel/panel.action';
import { CircularCarouselComponent } from 'app/shared/components/circular-carousel/circular-carousel.component';
import { LanguageModel } from 'app/store/general/general.model';
import { Observable } from 'rxjs';
import { Language } from 'app/store/general/general.state';

@Component({
  selector: 'app-container2',
  standalone: true, 
  imports: [NgIf, ContentDirective, LinkIconComponent, AirbusComponent, CircularCarouselComponent],
  templateUrl: './container2.component.html',
  styleUrls: ['./container2.component.scss','../../main-sections-shared-styles.scss']
})
export class Container2  {

  @Select(Language) language$!: Observable<LanguageModel>;

  @Input() nContainer!: number;

  constructor(private store: Store) { }

  activePanel!: number;
  activePageNum!: number;
  language!: string;

  ngOnInit() {
    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language
    });
  }

  changePanel(panel: number) {
    // console.log("changePanel", panel);
    this.activePanel = panel;
  }

  changePageNum(activePageNum: number) {
    // console.log("changePageNum", activePageNum);
    this.activePageNum = activePageNum;
  }

  goPage(pageNum: number) {
    console.log("GO PAGE", pageNum);
    const directAccess: DirectAccess = {hexNum: this.activePanel, nPage: pageNum};
    this.store.dispatch(new AccessPanelDirect(directAccess));
  }

}
