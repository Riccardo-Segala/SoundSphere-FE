import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { SessionService } from './services/session.service';
import {ResponseProductDTO} from "./api-client";
import {HttpClient} from "@angular/common/http";
import {ProdottoControllerService} from "./api-client";


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [CommonModule,RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    cercaProd:string='';
    prodotti:ResponseProductDTO[]=[];
    loggedUser:string|null=null;
    title='frontend';

    constructor(private http:HttpClient,private router:Router,private session:SessionService,private prodottoService: ProdottoControllerService) {
    }

    cerca(){

    }
    ngOnInit() {
        //this.loggedUser=this.session.getLoggedUser();
        //riceve il valore ogni volta che la variabile user$ viene aggiornata nel session service
        //tipo chiamata asincrona di API
        this.session.user$.subscribe(u=>this.loggedUser=u);
        this.caricaProdotti();
    }
    caricaProdotti(){
        if(this.cercaProd){
            //get prodotti by name/descrizione
        }
        else{
            this.prodottoService.getAllProducts().subscribe(prodotti => this.prodotti = prodotti);
        }
    }
    logout() :void {
        this.session.clearLoggedUser();
        this.loggedUser=this.session.getLoggedUser();
        this.router.navigate(['/']);
    }
}
