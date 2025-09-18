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
import {ProfiloDipendenteComponent} from "./components/admin-utenti/profilo-dipendente.component";
import {ListaDipendentiComponent} from "./components/dipendenti/lista-dipendenti.component";
import {ListaProdottiComponent} from "./components/prodotti/lista-prodotti.component";
import {FormProdottoComponent} from "./components/prodotti/form-prodotto.component";
import {FormFilialeComponent} from "./components/filiali/form-filiale.component";
import {ListaUtentiComponent} from "./components/admin-utenti/lista-utenti.component";
import {FormUtenteComponent} from "./components/admin-utenti/form-utente.component";
import {DatiStaticiComponent} from "./components/dati-statici/dati-statici.component";

export const routes: Routes = [
  {path: '', redirectTo: '/categorie', pathMatch: 'full' },
  {path: 'login', component: LoginComponent },
  {path: 'registrazione', component: ProfiloUtenteComponent },
  {path: 'modifica-profilo', component: ProfiloUtenteComponent},
  {path: 'catalogo-utente', component: CatalogoUtenteComponent },
  {path:'catalogo-utente/:slug',component:CatalogoUtenteComponent},
  {path: 'dettaglio-prodotto/:id',component: DettaglioProdottoComponent },
  {path: 'carrello',component:CarrelloComponent},
  {path:'wishlist',component:CarrelloComponent},
  {path:'categorie',component:CategorieComponent},
  {path:'categorie/:slug',component:CategorieComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'admin-page',component:AdminPageComponent},
  {path:'filiali',component:ListaFilialiComponent},
  {path:'filiali/modifica/:id',component:FormFilialeComponent},
  {path:'filiali/crea',component:FormFilialeComponent},
  {path:'dipendenti/modifica/:id',component:ProfiloDipendenteComponent},
  {path:'dipendenti',component:ListaDipendentiComponent},
  {path:'dipendenti/crea',component:ProfiloDipendenteComponent},
  {path:'prodotti',component:ListaProdottiComponent},
  {path:'prodotti/modifica/:id',component:FormProdottoComponent},
  {path:'prodotti/crea',component:FormProdottoComponent},
  {path:'utenti',component:ListaUtentiComponent},
  {path:'utenti/modifica/:id',component:FormUtenteComponent},
  {path:'utenti/crea',component:FormUtenteComponent},
  {path:'dati-statici',component:DatiStaticiComponent}
];