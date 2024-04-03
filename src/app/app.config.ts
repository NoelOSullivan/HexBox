import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { RotationToAdd, ActivePanelNumber } from './store/hexagon/hexagon.state';
import { PageCounters, PageTurner } from './store/panel/panel.state';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(NgxsModule.forRoot([ActivePanelNumber, RotationToAdd, PageCounters, PageTurner], {developmentMode: !environment.production})),
    importProvidersFrom(NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }))]
};