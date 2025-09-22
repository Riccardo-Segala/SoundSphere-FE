import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {
    CarrelloControllerService, CatalogProductDTO,
    ProdottoControllerService, ResponseCartDTO,
} from "../../api-client";
import {map} from "rxjs";
import {CarrelloModel} from "../../models/carrello.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {UtenteModel} from "../../models/utente.model";
import {ProductCardComponent} from "../../shared/components/product-card/product-card.component";
import {ProdottoModel} from "../../models/prodotto.model";

@Component({
    selector: "app-catalogo",
    standalone: true,
    templateUrl: `catalogo-utente.component.html`,
    styleUrl: `catalogo-utente.component.scss`,
    imports: [
        FormsModule,
        NgForOf,
        RouterModule,
        CommonModule,
        ProductCardComponent
    ]
})
export class CatalogoUtenteComponent implements OnInit {
    cercaProd:string='';

    prodotti:ProdottoModel[]=[];
    loggedUser:UtenteModel|null=null;
    prodFiltrati:ProdottoModel[]=[];

    carrello:CarrelloModel[]=[];
    errore:string="";
    slug:string|null=null;

    constructor(private http:HttpClient,
                private route:ActivatedRoute,
                private router:Router,
                private session:SessionService,
                private prodottoService: ProdottoControllerService,
                private carrelloService:CarrelloControllerService) {
    }

    ngOnInit() {
        this.loggedUser=this.session.getUser();
        this.slug=this.route.snapshot.paramMap.get('slug');
        if(this.slug){
            this.prodottoService.getOnlineCatalogBySlug(this.slug)
                .pipe(map(dtos=>mapper.mapArray<CatalogProductDTO,ProdottoModel>(dtos,'CatalogProductDTO','ProdottoModel')))
                .subscribe({
                    next:(prodotti:ProdottoModel[]) => {
                        this.prodotti = prodotti;
                        this.filtraProdotti();
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
        if(this.loggedUser){
            this.carrelloService.getAllCartOfUser()
                .pipe(map(dtos=>mapper.mapArray<ResponseCartDTO,CarrelloModel>(dtos,'ResponseCartDTO','CarrelloModel')))
                .subscribe({
                    next:(res:CarrelloModel[])=>{
                        this.carrello=res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento carrello: ",JSON.stringify(err));
                    }
                });
        }
    }

    filtraProdotti() {
        if(this.cercaProd==""){
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

    canRent(){
        const ruoliUtente=this.loggedUser?.ruoli?.map(ruolo=>ruolo.nome);
        return ruoliUtente?.includes("ORGANIZZATORE_EVENTI");
    }
    protected readonly unescape = unescape;
}