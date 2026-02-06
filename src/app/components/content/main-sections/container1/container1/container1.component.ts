import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { Select } from '@ngxs/store';

import { LogoComponent } from '../../../../../shared/components/logo/logo.component';

import { AppState } from 'app/store/general/general.state';
import { AppStateModel, IntroState, LanguageModel } from 'app/store/general/general.model';
import { Observable } from 'rxjs';
import { Language } from 'app/store/general/general.state';
import { NextPageButtonComponent } from 'app/shared/components/next-page-button/next-page-button.component';
import { BichromeTitleComponent } from 'app/shared/components/bichrome-title/bichrome-title.component';

@Component({
    selector: 'app-container1',
    imports: [ContentDirective, LogoComponent, BichromeTitleComponent, NextPageButtonComponent],
    templateUrl: './container1.component.html',
    styleUrls: ['./container1.component.scss', '../../main-sections-shared-styles.scss']
})

export class Container1 implements OnInit {

  @Select(AppState) appState$!: Observable<AppStateModel>;
  @Select(Language) language$!: Observable<LanguageModel>;

  @Input() nContainer!: number;

  constructor() { }
  
  showSwipe: boolean = false;
  activePageNum: number = 0;
  isLastPage: boolean = false;

  appState!: AppStateModel;
  introState!: IntroState;
  blockAll!: boolean;
  videosFinished: boolean = false;
  language!: string;
  introDone: boolean = false;

  changePageNum(activePageNum: number) {
    if (this.activePageNum !== activePageNum) {
      this.activePageNum = activePageNum;
    }
  }

  setIsLastPage(isLastPage: boolean) {
    this.isLastPage = isLastPage;
  }

  ngOnInit(): void {
    this.appState$.subscribe(newAppState => {
      this.appState = newAppState;
      if (this.appState.blockAll !== this.blockAll) {
        this.blockAll = this.appState.blockAll
      }
    });

    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language
    });
  }

}
