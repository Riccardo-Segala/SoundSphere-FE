import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpContext} from "@angular/common/http";
import {SessionService} from "../../services/session.service";
import {Router,RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {
    CarrelloControllerService, CatalogProductDTO,
    ProdottoControllerService, ResponseCartDTO,
    ResponseUserDTO,
    UtenteControllerService, UpdateCartItemDTO
} from "../../api-client";
import {ResponseProductDTO} from "../../api-client";
import {map, Observable} from "rxjs";
import {CarrelloModel} from "../../models/carrello.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {UtenteModel} from "../../models/utente.model";

@Component({
    selector: "app-catalogo",
    standalone: true,
    templateUrl: `./catalogo-utente.component.html`,
    styleUrl: `./catalogo-utente.component.scss`,
    imports: [
        FormsModule,
        NgForOf,
        RouterModule,
        CommonModule
    ]
})
export class CatalogoUtenteComponent implements OnInit {
    cercaProd:string='';
    prodotti:CatalogProductDTO[]=[];
    loggedUser:UtenteModel={};
    prodFiltrati:CatalogProductDTO[]=[];
    carrello:CarrelloModel[]=[];
    errore:string="";

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
            this.loggedUser=this.session.getUser() as UtenteModel;
        }
        console.log(this.loggedUser.nome+" "+this.loggedUser.cognome);
        this.prodottoService.getOnlineCatalog().subscribe({
            next:(prodotti) => {
                this.prodotti = prodotti;
                this.filtraProdotti();
            },
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

    aggiungiCarrello(id:string|undefined,wishlist:boolean){
        if(id){
            for(let p of this.prodotti){
                if(p.id==id){
                    this.carrelloService.updateItemInCart({
                        prodottoId:id,
                        quantita:1,
                        wishlist:wishlist
                    }).pipe(map(dto=>mapper.map<ResponseCartDTO,CarrelloModel>(dto,'ResponseCartDTO','CarrelloModel')))
                        .subscribe({
                        next:(res:CarrelloModel)=>{
                            this.carrello.push(res);
                        },
                        error:(err)=>{
                            console.log("Errore inserimento in carrello/wishlist: "+err);
                        }
                    });
                }
                else{
                    this.errore="Non è stato trovato il prodotto da aggiungere";
                }
            }
        }
    }
    disponibileCarrello(id:string|undefined):boolean{
        const prod=this.prodFiltrati.find(i=>i.id==id);
        if(prod){
            if(!(prod.quantitaDisponibile && prod.quantitaDisponibile>0)){
                return false;
            }
        }
        else{
            return false;
        }

        const cart=this.carrello.find(c=>c.prodotto.id==id)
        return !(cart && !cart.wishlist && cart.quantita > 0);

    }
    disponibileWishlist(id:string|undefined):boolean{
        const cart=this.carrello.find(c=>c.prodotto.id==id)
        return !(cart && cart.wishlist);
    }
}