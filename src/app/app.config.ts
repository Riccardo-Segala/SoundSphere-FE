import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import { routes } from './app.routes';
import {authKeyInterceptor} from "./interceptors/auth-key.interceptor";

/* definisce quali istruzione devono essere disponibili a partire
dall'avvio del sito
*/
export const appConfig: ApplicationConfig = {
  providers: [
      // rileva cambiamenti, raggruppando più eventi avvenuti in breve tempo
    provideZoneChangeDetection({ eventCoalescing: true }),
      // permette di conoscere le routes del sito
    provideRouter(routes),
      // informa della presenza di un interceptor
    provideHttpClient(withInterceptorsFromDi()),{
      provide: HTTP_INTERCEPTORS,
      useClass:authKeyInterceptor, //la classe dell'interceptor
      multi:true // non sovrascrive quelli già presenti, me permette di usarne più di uno
    }
  ]
};
