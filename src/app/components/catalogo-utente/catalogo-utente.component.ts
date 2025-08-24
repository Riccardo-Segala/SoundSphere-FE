import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpContext} from "@angular/common/http";
import {SessionService} from "../../services/session.service";
import {Router,RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {
    CarrelloControllerService,
    ProdottoControllerService, ResponseCartDTO,
    ResponseUserDTO,
    UtenteControllerService
} from "../../api-client";
import {ResponseProductDTO} from "../../api-client";
import {map, Observable} from "rxjs";
import {UpdateCartDTO} from "../../api-client/model/updateCartDTO";
import {CarrelloModel} from "../../models/carrello.model";
import {mapper} from "../../core/mapping/mapper.initializer";

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
    //loggedUser:string|null=null;
    loggedUser:ResponseUserDTO={};
    prodFiltrati:ResponseProductDTO[]=[];
    carrello:CarrelloModel[]=[];

    constructor(private http:HttpClient,
                private router:Router,
                private session:SessionService,
                private prodottoService: ProdottoControllerService,
                private carrelloService:CarrelloControllerService,
                private utenteService:UtenteControllerService) {
    }

    ngOnInit() {
        //servirebbe get da filiale 'online'
        if(this.session.getUser()){
            this.loggedUser=this.session.getUser() as ResponseUserDTO;
        }
        console.log(this.loggedUser.nome+" "+this.loggedUser.cognome);
        this.prodottoService.getAllProducts().subscribe({
            next:(prodotti) => {
            this.prodotti = prodotti;
            this.filtraProdotti();},
            error: (err) => {
                console.log(err);
            }
        });
        this.carrelloService.getAllCartOfUser()
            .pipe(map(dtos=>mapper.mapArray<ResponseCartDTO,CarrelloModel>(dtos,'ResponseCartDTO','CarrelloModel')))
            .subscribe(c=>this.carrello = c);
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

    aggiungiCarrello(id:string|undefined){
        if(id){
            for(let p of this.prodotti){
                if(p.id==id){
                    this.carrelloService.updateItemInCart({
                        prodottoId:id,
                        quantita:1,
                        wishlist:false
                    }).subscribe();
                }
            }
        }
    }
    inCarrello(id:string|undefined):boolean{
        for(let c of this.carrello){
            for(let p of this.prodotti){
                if(p.id===c.prodotto.id && c.quantita!==undefined && c.quantita>0)
                    return true;
            }
        }
        return false;
    }
}