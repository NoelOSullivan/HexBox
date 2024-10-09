import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LanguageModel } from 'app/store/general/general.model';
import { Language } from 'app/store/general/general.state';
import { ChangeLanguage } from 'app/store/general/general.actions';

@Component({
  selector: 'app-lang-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './lang-button.component.html',
  styleUrls: ['./lang-button.component.scss']
})
export class LangButtonComponent implements OnInit {

  @Select(Language) language$!: Observable<LanguageModel>;
  
  constructor(private store: Store) { }

  language!: String;

  ngOnInit() {

    this.language$.subscribe(newLanguage => {
      this.language = newLanguage.language;
    });
  }

  changeLanguage(language: string) {
    this.store.dispatch(new ChangeLanguage(language));
  }

  

}