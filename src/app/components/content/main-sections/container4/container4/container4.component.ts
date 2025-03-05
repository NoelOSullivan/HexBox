import { Component, Input } from '@angular/core';
import { ContentDirective } from '../../../../../shared/directives/content.directive';
import { NgIf } from '@angular/common';
import { DirectAccessComponent } from '../../../../../shared/components/direct-access/direct-access.component';
import { Select } from '@ngxs/store';
import { Language } from 'app/store/general/general.state';
import { Observable } from 'rxjs';
import { LanguageModel } from 'app/store/general/general.model';

@Component({
  selector: 'app-container4',
  standalone: true, 
  imports: [NgIf, ContentDirective, DirectAccessComponent],
  templateUrl: './container4.component.html',
  styleUrls: ['./container4.component.scss','../../main-sections-shared-styles.scss']
})
export class Container4  {
  
  @Select(Language) language$!: Observable<LanguageModel>;

  // @Input() nContainer!: number;

  language!: string;

  constructor() { }

  ngOnInit() {
    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language
    });
  }

}
