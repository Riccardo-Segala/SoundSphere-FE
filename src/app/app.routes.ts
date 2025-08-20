import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegistrazioneComponent} from "./components/registrazione/registrazione.component";
import {CatalogoUtenteComponent} from "./components/catalogo-utente/catalogo-utente.component";
import {DettaglioProdottoComponent} from "./components/catalogo-utente/dettaglio-prodotto.component";
import {CarrelloComponent} from "./components/carrello/carrello.component";

export const routes: Routes = [
  { path: '', redirectTo: '/catalogo-utente', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  { path: 'catalogo-utente', component: CatalogoUtenteComponent },
  { path: 'dettaglio-prodotto/:id',component: DettaglioProdottoComponent },
  { path: 'carrello',component:CarrelloComponent}
];