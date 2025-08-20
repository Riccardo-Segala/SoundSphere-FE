import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpContext} from "@angular/common/http";
import {SessionService} from "../../services/session.service";
import {Router,RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {ProdottoControllerService} from "../../api-client";
import {ResponseProductDTO} from "../../api-client";
import {Observable} from "rxjs";

@Component({
    selector: "app-catalogo",
    standalone: true,
    templateUrl: `/catalogo-utente.component.html`,
    styleUrl: `/catalogo-utente.component.scss`,
    imports: [
        FormsModule,
        NgForOf,
        RouterModule
    ]
})
export class CatalogoUtenteComponent implements OnInit {
    cercaProd:string='';
    prodotti:ResponseProductDTO[]=[];
    loggedUser:string|null=null;
    prodFiltrati:ResponseProductDTO[]=[];
    constructor(private http:HttpClient,private router:Router,private session:SessionService,private prodottoService: ProdottoControllerService) {
    }

    ngOnInit() {
        //servirebbe get da filiale 'online'
        this.loggedUser=this.session.getLoggedUser();
        this.prodottoService.getAllProducts().subscribe(prodotti => {
            this.prodotti = prodotti;
            this.filtraProdotti();

        });

    }

    filtraProdotti() {
        if(this.cercaProd==""){
            //get prodotti by name/descrizione e filiale
            this.prodFiltrati=this.prodotti;
            return;
        }
        else{
            this.prodFiltrati=this.prodotti.filter(p=>(p.nome?.toLowerCase().includes(this.cercaProd.toLowerCase()))||(p.nome?.toLowerCase().includes(this.cercaProd.toLowerCase()))||(p.marca?.toLowerCase().includes(this.cercaProd.toLowerCase())));
        }
    }
}