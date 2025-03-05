import { Component, Input, OnInit } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { CircularCarouselComponent } from 'app/shared/components/circular-carousel/circular-carousel.component';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LanguageModel } from 'app/store/general/general.model';
import { Language } from 'app/store/general/general.state';

@Component({
  selector: 'app-container6',
  standalone: true,
  imports: [NgIf, ContentDirective, LogoComponent, CircularCarouselComponent],
  templateUrl: './container6.component.html',
  styleUrls: ['./container6.component.scss', '../../main-sections-shared-styles.scss']
})
export class Container6 implements OnInit {

  @Select(Language) language$!: Observable<LanguageModel>;

  @Input() nContainer!: number;

  activePanel!: number;
  activePageNum: number = 0;
  language!: string;
  iAmActive: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.language$.subscribe(newLanguage => {
      this.language! = newLanguage.language;
    });
  }

  changePanel(panel: number) {
    this.activePanel = panel;
    this.iAmActive = this.nContainer === this.activePanel;
  }

}
