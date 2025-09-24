import {Component, OnInit} from "@angular/core";
import {CommonModule, NgForOf} from '@angular/common';
import {
    CarrelloControllerService, DatiStaticiControllerService, DeleteCartDTO,
    DeliveryLimitDataDTO, ProdottoControllerService, ResponseCartDTO, UpdateCartItemDTO,
    UtenteControllerService
} from "../../api-client";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {UtenteModel} from "../../models/utente.model";
import {ProdottoModel} from "../../models/prodotto.model";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {CarrelloModel} from "../../models/carrello.model";
import {UpdateCartDTO} from "../../api-client/model/updateCartDTO";
import {DatiSpedizioneModel} from "../../models/dati-spedizione.model";

@Component({
    selector: 'app-carrello',
    standalone: true,
    imports: [
        FormsModule,NgForOf,CommonModule
    ],
    templateUrl:'/carrello.component.html',
    styleUrl:'carrello.component.scss'
})

export class CarrelloComponent implements OnInit {
    loggedUser:UtenteModel={};
    carrello:CarrelloModel[]=[];
    totalePrezzo:number=0;
    totaleGiornaliero:number=0;
    costoSpedizione:number=0;
    sogliaSpedizioneGratis:number=0;

    constructor(
        private session:SessionService,
        private router:Router,
        private route:ActivatedRoute,
        private http:HttpClient,
        private userService:UtenteControllerService,
        private carrelloService:CarrelloControllerService,
        private prodottoService:ProdottoControllerService,
        private datiStaticiService: DatiStaticiControllerService
    ){}

    ngOnInit() {
        if(this.session.getUser()){
            this.loggedUser=this.session.getUser() as UtenteModel;
            if(this.router.url.includes("/carrello")){
                this.carrelloService.getAllCartOfUser()
                    .pipe(map(dtos=>mapper.mapArray<ResponseCartDTO,CarrelloModel>(dtos,'ResponseCartDTO','CarrelloModel')))
                    .subscribe({
                        next:(carrello:CarrelloModel[])=>{
                            this.carrello=carrello;
                            this.calcolaStelleMedie();
                            this.calcolaTotali();
                        },
                        error:(err)=>{
                            console.log("Errore ottenimento carrello: "+err)
                        }
                    });
            }
            else{
                this.carrelloService.getAllWishlist()
                    .pipe(map(dtos=>mapper.mapArray<ResponseCartDTO,CarrelloModel>(dtos,'ResponseCartDTO','CarrelloModel')))
                    .subscribe({
                        next:(carrello:CarrelloModel[])=>{
                            this.carrello=carrello;
                            this.calcolaStelleMedie();

                        },
                        error:(err)=>{
                            console.log("Errore ottenimento carrello: "+err)
                        }
                    });
            }
        }
        else{
            this.router.navigate(['/']);
        }
        this.caricaDatiSpedizione()
    }

    caricaDatiSpedizione(): void {
        this.datiStaticiService.getDeliveryDataAndLimits()
            .pipe(map(dto=>mapper.map<DeliveryLimitDataDTO,DatiSpedizioneModel>(dto,'DeliveryLimitDataDTO','DatiSpedizioneModel')))
            .subscribe({
                next:(dati:DatiSpedizioneModel)=>{
                    this.costoSpedizione=dati.costoSpedizione ? dati.costoSpedizione : 0;
                    this.sogliaSpedizioneGratis=dati.sogliaSpedizioneGratuita ? dati.sogliaSpedizioneGratuita : 0;
                    console.log("Dati spedizione caricati: ",JSON.stringify(dati));
                },
                error:(err)=>{
                    console.log("Errore ottenimento dati spedizione: "+err);
                }
        });
    }

    calcolaStelleMedie(){
        for(let c of this.carrello){
            if(c.prodotto.id){
                this.prodottoService.getAverageStars(c.prodotto.id).subscribe({
                    next:(avg)=>{
                        c.prodotto.stelleMedie=avg;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento stelle medie: "+err);
                    }
                });
            }
        }
    }
    checkoutOrdine(){
        this.router.navigate(["/checkout/ordine"]);
    }

    checkoutNoleggio(){
        this.router.navigate(["checkout/noleggio"]);
    }

    rimuoviTutto(){
        const items:DeleteCartDTO={};
        items.productIds=this.carrello.map(item=>item.prodotto.id) as string[];
        this.carrelloService.removeItemsFromCart(items).subscribe({
            next:(res)=>{
                console.log("Rimozione riuscita");
                this.carrello=[];
            },
            error:(err)=>{
                console.log("Errore rimozione prodotto: "+err);
            }
        })
    }
    rimuovi(id:string|undefined){
        if(id){
            this.carrelloService.removeItemFromCart(id).subscribe({
                next:(res)=>{
                    console.log("Prodotto rimosso");
                    this.carrello.find(item=>item.prodotto.id==id);
                    this.carrello=this.carrello.filter(c=>c.prodotto.id!==id);
                    this.calcolaTotali();
                },
                error:(err)=>{
                    console.log("Rimozione non riuscita");
                }
            });
        }
        else{
            console.log("Prodotto nel carrello non trovato");
        }
    }

    canRent(){
        const nomiRuoli=this.loggedUser.ruoli?.map(ruolo=>ruolo.nome);
        return nomiRuoli?.includes("ORGANIZZATORE_EVENTI");
    }

    calcolaTotali(){
        this.totalePrezzo=0;
        this.totaleGiornaliero=0;
        for(let c of this.carrello){
            this.totalePrezzo+= c.prodotto.prezzo ? c.prodotto.prezzo*c.quantita : 0;
            this.totaleGiornaliero+= c.prodotto.costoGiornaliero ? c.prodotto.costoGiornaliero : 0;
        }
    }

    incrementaQuantita(item:CarrelloModel){
        item.quantita+=1;
        this.updateCart(item);

    }
    decrementaQuantita(item:CarrelloModel){
        if (item.quantita > 1) {
            item.quantita -= 1;
            this.updateCart(item);
        }
    }

    updateCart(item:CarrelloModel){
        const cartItem:UpdateCartItemDTO={
            prodottoId:item.prodotto.id,
            quantita:item.quantita,
            wishlist:false
        };
        if(item.prodotto.id){
            this.carrelloService.updateItemInCart(cartItem)
                .subscribe({
                next:(res)=>{
                    const index = this.carrello.findIndex(
                        cartElement => cartElement.prodotto.id === item.prodotto.id
                    );

                    if (index !== -1) {
                        this.carrello[index] = item;
                        console.log("Variabile 'carrello' locale aggiornata");
                    }
                    this.calcolaTotali();
                },
                error:(err)=>{
                    console.log("Errore aggiornamento carrello: "+err);
                }
            })
        }
    }
}