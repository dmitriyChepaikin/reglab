import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {userReducer} from './store/reducers/user.reducer';

import {routes} from './app.routes';
import {provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {UserEffects} from "./store/effects/user.effects";
import {provideHttpClient} from "@angular/common/http";
import {appProviders} from "./app.providers";
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";
import {channelsReducer} from "./store/reducers/channels.reducer";
import {ChannelsEffects} from "./store/effects/channels.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideStore({users: userReducer, channels: channelsReducer}),
    provideEffects([UserEffects, ChannelsEffects]),
    importProvidersFrom([BrowserAnimationsModule]),
    provideAnimations(),
    provideHttpClient(),
    appProviders
  ]
};
