import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { Select, Store } from '@ngxs/store';


import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { LinkIconComponent } from '../../../../../shared/components/link-icon/link-icon.component';
import { AirbusComponent } from './airbus/airbus.component';
import { ThesunComponent } from './thesun/thesun.component';
import { DirectAccess, PageChange } from '../../../../../shared/interfaces/panel';
import { AccessPanelDirect } from '../../../../../store/panel/panel.action';
import { CircularCarouselComponent } from 'app/shared/components/circular-carousel/circular-carousel.component';
import { AppStateModel, LanguageModel } from 'app/store/general/general.model';
import { Observable } from 'rxjs';
import { Language, } from 'app/store/general/general.state';
import { AppState } from 'app/store/general/general.state';
import { NextPageButtonComponent } from 'app/shared/components/next-page-button/next-page-button.component';

@Component({
  selector: 'app-container2',
  standalone: true,
  imports: [NgIf, ContentDirective, LinkIconComponent, AirbusComponent, ThesunComponent, CircularCarouselComponent, LogoComponent, NextPageButtonComponent],
  templateUrl: './container2.component.html',
  styleUrls: ['./container2.component.scss', '../../main-sections-shared-styles.scss']
})
export class Container2 {

  @Select(Language) language$!: Observable<LanguageModel>;
  @Select(AppState) appState$!: Observable<AppStateModel>;

  // appState: AppStateModel;

  @Input() nContainer!: number;
  // @Input() contentHeight!: number;

  constructor(private store: Store) { }

  activePanel!: number;
  activePageNum: number  | undefined= 0;
  subPageNum: number | undefined = 2;
  language!: string;
  iAmActive: boolean = false;
  backButtonClick!: boolean;
  robotAirbusAnim!: boolean;
  recentreCarousel: boolean = false;
  blockAll: boolean = false;

  ngOnInit() {
    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language
    });

    this.appState$.subscribe(appState => {
      if (this.robotAirbusAnim !== appState.robotAirbusAnim) {
        this.robotAirbusAnim = appState.robotAirbusAnim;
      }

      if (appState.blockAll !== this.blockAll) {
        this.blockAll = appState.blockAll
      }
    })

  }

  // To Do. Perhaps move this logic to content.directive
  // It is only needed for panels which need to communicate info to a child eg:carousel

  changePanel(panel: number) {
    // activePanel takes the value of the new panel after hexagon click
    this.activePanel = panel;
    // detect if this container is the active one
    if (this.activePanel === this.nContainer) {
      this.iAmActive = true;
      this.recentreCarousel = true;
    } else {
      this.iAmActive = false;
      this.recentreCarousel = false;
      // this.goPage(1);
    }
  }

  changePageNum(pageChange: PageChange) {
    // debugger;
    console.log("pageChange", pageChange);
    this.subPageNum = pageChange.subPageNum;
    this.activePageNum = pageChange.nPage;
  }

  goPage(pageNum:number) {
    // if (this.nContainer === this.activePanel) {
    if(pageNum) {
      this.subPageNum = pageNum;
      console.log("subPageNum", this.subPageNum);
      const directAccess: DirectAccess = { hexNum: this.nContainer, nPage: 1, subPageNum: pageNum };
      this.store.dispatch(new AccessPanelDirect(directAccess));
    }
    // } 
  }

}
