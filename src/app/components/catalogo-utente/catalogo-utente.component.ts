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
        if (!id) {
            return false;
        }

        // 2. Controlla se il prodotto esiste e ha scorte disponibili
        const prodotto = this.prodFiltrati.find(p => p.id === id);

        if (!prodotto || ! prodotto.quantitaDisponibile || !(prodotto.quantitaDisponibile > 0)) {
            // Se il prodotto non esiste o la quantità è 0 (o null/undefined),
            // non è disponibile per l'aggiunta.
            return false;
        }

        // 3. Controlla se un articolo identico è GIA' nel carrello
        // Usiamo .some() perché è più efficiente: si ferma appena trova una corrispondenza.
        const giaNelCarrello = this.carrello.some(item =>
            item.prodotto.id === id &&
            !item.wishlist &&        // Non è nella wishlist
            item.quantita > 0        // E la sua quantità è maggiore di zero
        );

        // Se è già nel carrello, non può essere aggiunto di nuovo.
        if (giaNelCarrello) {
            return false;
        }

        // Se tutti i controlli sono stati superati, il prodotto è disponibile!
        return true;

    }
    disponibileWishlist(id:string|undefined):boolean{
        // 1. Se l'ID non è valido, non può essere aggiunto.
        if (!id) {
            return false;
        }

        // 2. Controlla se un articolo con lo stesso ID è GIA' presente come "wishlist".
        //    Usiamo .some() per efficienza.
        const giaNellaWishlist = this.carrello.some(item =>
            item.prodotto.id === id && item.wishlist
        );

        // 3. Il prodotto è "disponibile" per la wishlist se NON è già presente.
        //    Quindi, restituiamo il valore negato del nostro controllo.
        return !giaNellaWishlist;
    }

    livelloVantaggio():number {
        if(this.loggedUser && this.loggedUser.vantaggio && this.loggedUser.vantaggio.sconto){
            return this.loggedUser.vantaggio.sconto;
        }
        return 0;
    }

    protected readonly unescape = unescape;
}