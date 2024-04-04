import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';
import { routes } from './app.routes';
import { TodoState } from './store/todo.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(NgxsModule.forRoot([TodoState])),
  ],
};
