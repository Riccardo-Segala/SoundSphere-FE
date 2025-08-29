import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ProfiloUtenteComponent} from "./components/profilo-utente/profilo-utente.component";
import {CatalogoUtenteComponent} from "./components/catalogo-utente/catalogo-utente.component";
import {DettaglioProdottoComponent} from "./components/catalogo-utente/dettaglio-prodotto.component";
import {CarrelloComponent} from "./components/carrello/carrello.component";
import {CategorieComponent} from "./components/catalogo-utente/categorie.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {AdminPageComponent} from "./components/admin/admin-page.component";
import {ListaFilialiComponent} from "./components/filiali/lista-filiali.component";

export const routes: Routes = [
  { path: '', redirectTo: '/categorie', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: ProfiloUtenteComponent },
  { path: 'modifica-profilo', component: ProfiloUtenteComponent},
  { path: 'catalogo-utente', component: CatalogoUtenteComponent },
  {path:'catalogo-utente/:idCategoria',component:CatalogoUtenteComponent},
  { path: 'dettaglio-prodotto/:id',component: DettaglioProdottoComponent },
  { path: 'carrello',component:CarrelloComponent},
  { path:'wishlist',component:CarrelloComponent},
  { path:'categorie',component:CategorieComponent},
  {path: 'categorie/:id',component:CategorieComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'admin-page',component:AdminPageComponent},
  {path: 'filiali',component:ListaFilialiComponent}
];