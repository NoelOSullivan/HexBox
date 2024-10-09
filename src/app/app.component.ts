import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from './components/layout.component';
import { Store } from '@ngxs/store';
import { ChangeLanguage } from './store/general/general.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  title = 'HexBox';

  constructor(private store: Store) {}

  ngOnInit() {
    let language: string;
    language = "En";
    if(navigator.language.toLowerCase().includes("fr")) {
      language = "Fr";
    }
    this.store.dispatch(new ChangeLanguage(language));
  }

}
