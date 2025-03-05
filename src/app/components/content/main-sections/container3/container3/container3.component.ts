import { Component, Input } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { LogoComponent } from 'app/shared/components/logo/logo.component';
import { Select } from '@ngxs/store';
import { LanguageModel } from 'app/store/general/general.model';
import { Observable } from 'rxjs';
import { Language } from 'app/store/general/general.state';
import { BichromeTitleComponent } from 'app/shared/components/bichrome-title/bichrome-title.component';

@Component({
  selector: 'app-container3',
  standalone: true, 
  imports: [NgIf, ContentDirective, LogoComponent, BichromeTitleComponent],
  templateUrl: './container3.component.html',
  styleUrls: ['./container3.component.scss','../../main-sections-shared-styles.scss']
})
export class Container3  {

  @Select(Language) language$!: Observable<LanguageModel>;
  @Input() nContainer!: number;

  language!: string;

  constructor() { }

  ngOnInit() {
    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language
    });
  }

}
