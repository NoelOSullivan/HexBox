import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { Select, Store } from '@ngxs/store';


import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { LinkIconComponent } from '../../../../../shared/components/link-icon/link-icon.component';
import { AirbusComponent } from './airbus/airbus.component';
import { DirectAccess } from '../../../../../shared/interfaces/panel';
import { AccessPanelDirect } from '../../../../../store/panel/panel.action';
import { CircularCarouselComponent } from 'app/shared/components/circular-carousel/circular-carousel.component';
import { AppStateModel, LanguageModel } from 'app/store/general/general.model';
import { Observable } from 'rxjs';
import { Language,  } from 'app/store/general/general.state';
import { AppState } from 'app/store/general/general.state';

@Component({
  selector: 'app-container2',
  standalone: true,
  imports: [NgIf, ContentDirective, LinkIconComponent, AirbusComponent, CircularCarouselComponent, LogoComponent],
  templateUrl: './container2.component.html',
  styleUrls: ['./container2.component.scss', '../../main-sections-shared-styles.scss']
})
export class Container2 {

  @Select(Language) language$!: Observable<LanguageModel>;
  @Select(AppState) appState$!: Observable<AppStateModel>;

  @Input() nContainer!: number;
  // @Input() contentHeight!: number;

  constructor(private store: Store) { }

  activePanel!: number;
  activePageNum: number = 0;
  language!: string;
  iAmActive: boolean = false;
  backButtonClick!: boolean;

  ngOnInit() {
    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language
    });

    this.appState$.subscribe(appState => {
      if(this.backButtonClick !== appState.backButtonClick) {
        this.backButtonClick = appState.backButtonClick;
        this.goPage(1);
      }

    })

  }

  // To Do. Perhaps move this logic to content.directive
  // It is only needed for panels which need to communicate info to a child eg:carousel

  changePanel(panel: number) {
    this.activePanel = panel;
    this.iAmActive = this.nContainer === this.activePanel;
  }

  changePageNum(activePageNum: number) {
    this.activePageNum = activePageNum;
  }

  goPage(pageNum: number) {
    const directAccess: DirectAccess = { hexNum: this.activePanel, nPage: pageNum };
    this.store.dispatch(new AccessPanelDirect(directAccess));
  }

}
