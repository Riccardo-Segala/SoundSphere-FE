import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SessionService} from "../../services/session.service";
import {Router} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {ProdottoControllerService} from "../../api-client";
import {ResponseProductDTO} from "../../api-client";
import {Observable} from "rxjs";

@Component({
    selector: "app-catalogo",
    standalone: true,
    //imports:[]
    templateUrl: `/catalogo-utente.component.html`,
    styleUrl: `/catalogo-utente.component.scss`,
    imports: [
        FormsModule,
        NgForOf
    ]
})
export class CatalogoUtenteComponent implements OnInit {
    cercaProd:string='';
    prodotti:ResponseProductDTO[]=[];
    loggedUser:string|null=null;

    constructor(private http:HttpClient,private router:Router,private session:SessionService,private prodottoService: ProdottoControllerService) {
    }

    ngOnInit() {
        //servirebbe get da filiale 'online'
        this.loggedUser=this.session.getLoggedUser();
        this.prodottoService.getAllProducts().subscribe(prodotti => this.prodotti = prodotti);
    }

    filtraProdotti():void {
        if(this.cercaProd){
            //get prodotti by name/descrizione e filiale
        }
        else{
            this.prodottoService.getAllProducts().subscribe(prodotti=>this.prodotti=prodotti);
        }
    }
}