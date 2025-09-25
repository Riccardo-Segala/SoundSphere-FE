import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
    ProdottoControllerService,
    ResponseProductDTO,
    CarrelloControllerService,
    UtenteControllerService,
    UpdateCartItemDTO
} from "../../api-client";
import {CommonModule,Location} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RecensioniComponent} from "../recensioni/recensioni.component";
import {UtenteModel} from "../../models/utente.model";
import {ProdottoModel} from "../../models/prodotto.model";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";

@Component({
    selector: "app-dettaglio",
    standalone: true,
    imports: [CommonModule, FormsModule, RecensioniComponent],
    templateUrl: "./dettaglio-prodotto.component.html",
    styleUrls: ["./dettaglio-prodotto.component.scss"],
})

export class DettaglioProdottoComponent implements OnInit {
    prodotto:ProdottoModel={};
    quantita:number=1;
    stelleMedie:number|undefined=undefined;
    loggedUser:UtenteModel|null=null;

    constructor(private route:ActivatedRoute,
                private session: SessionService,
                private router: Router,
                private prodottoService:ProdottoControllerService,
                private cartService:CarrelloControllerService,
                private userService:UtenteControllerService,
                private location:Location) {
    }

    ngOnInit() {
        const id=this.route.snapshot.paramMap.get("id");
        if(id){
            this.prodottoService.getProductById(id)
                .pipe(map(dto=>mapper.map<ResponseProductDTO,ProdottoModel>(dto,'ResponseProductDTO','ProdottoModel')))
                .subscribe({
                    next:(res:ProdottoModel)=>{
                        this.prodotto=res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento prodotto: ",JSON.stringify(err));
                    }
                });
            this.prodottoService.getAverageStars(id).subscribe({
                next:(res)=>{
                    this.stelleMedie=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento stelle medie: ",JSON.stringify(err));
                }
            })
        }
        this.loggedUser=this.session.getUser();
    }

    addToWishlist(){
        const prodId=this.route.snapshot.paramMap.get("id");
        if(!prodId){

            return;
        }
        else {
            const cartItem:UpdateCartItemDTO={
                prodottoId:prodId,
                quantita:this.quantita,
                wishlist:true
            };
            this.cartService.updateItemInCart(cartItem).subscribe({
                next:(response)=>{
                    if(response){
                        //this.location.back();
                    }
                },
                error:()=>{
                   console.log("Errore nell'inserimento del prodotto nel carrello");
                }
            })
        }
    }

    addToCart(){
        const prodId=this.route.snapshot.paramMap.get("id");
        if(!prodId){
            return;
        }
        else {

            const cartItem:UpdateCartItemDTO={
                prodottoId:prodId,
                quantita:this.quantita,
                wishlist:false
            };
            this.cartService.updateItemInCart(cartItem).subscribe({
                next:(response)=>{

                },
                error:()=>{
                    console.log("Errore nell'inserimento del prodotto nel carrello");
                }
            })
        }
    }
    annulla(){
        this.location.back();
    }

    incrementaQuantita(){
        this.quantita+=1;
    }
    decrementaQuantita(){
        this.quantita-=1;
    }
    canRent(){
        const nomiRuoli=this.loggedUser?.ruoli?.map(ruolo=>ruolo.nome);
        return nomiRuoli?.includes("ORGANIZZATORE_EVENTI");
    }

    prezzoScontato():number{
        if(this.prodotto.prezzo && this.loggedUser?.vantaggio?.sconto){
            return this.prodotto.prezzo*(100-this.loggedUser.vantaggio.sconto)/100
        }
        return 0;
    }
    prezzoScontatoGiornaliero(){
        if(this.prodotto.costoGiornaliero && this.loggedUser?.vantaggio?.sconto){
            return this.prodotto.costoGiornaliero*(100-this.loggedUser.vantaggio.sconto)/100
        }
        return 0;
    }
}