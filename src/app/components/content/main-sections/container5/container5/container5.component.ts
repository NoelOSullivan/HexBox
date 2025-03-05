import { Component, Input } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { Select } from '@ngxs/store';
import { Language } from 'app/store/general/general.state';
import { Observable } from 'rxjs';
import { LanguageModel } from 'app/store/general/general.model';
import { LogoComponent } from 'app/shared/components/logo/logo.component';

@Component({
  selector: 'app-container5',
  standalone: true, 
  imports: [NgIf, ContentDirective, LogoComponent],
  templateUrl: './container5.component.html',
  styleUrls: ['./container5.component.scss','../../main-sections-shared-styles.scss']
})
export class Container5  {

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
