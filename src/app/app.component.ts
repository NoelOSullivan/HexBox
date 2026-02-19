import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from './components/layout.component';
import { Store } from '@ngxs/store';
import { ChangeLanguage } from './store/general/general.actions';
import { LanguageService } from './services/language.service';

@Component({
    selector: 'app-root',
    imports: [LayoutComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  protected language = inject(LanguageService);

  title = 'HexBox';

  constructor(private store: Store) {}

  ngOnInit() {
    let language: string;
    language = "En";
    if(navigator.language.toLowerCase().includes("fr")) {
      language = "Fr";
    }
    // console.log("language", language);
    this.store.dispatch(new ChangeLanguage(language));
    this.language.setLanguage(language);

    
  }

}
