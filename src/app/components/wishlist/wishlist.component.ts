import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UtenteModel} from "../../models/utente.model";
import {CarrelloModel} from "../../models/carrello.model";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {
    CarrelloControllerService, ResponseCartDTO, UpdateCartItemDTO,
    UtenteControllerService
} from "../../api-client";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";

@Component({
  selector: 'app-wishlist',
    imports: [
        FormsModule,
        NgForOf,
    ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit
{
    loggedUser:UtenteModel={};
    wishlist:CarrelloModel[]=[];

    constructor(
        private session:SessionService,
        private router:Router,
        private route:ActivatedRoute,
        private http:HttpClient,
        private userService:UtenteControllerService,
        private carrelloService:CarrelloControllerService
    ){}

    ngOnInit() {
        if(this.session.getUser()){
            this.loggedUser=this.session.getUser() as UtenteModel;

            this.carrelloService.getAllWishlist()
                .pipe(map(dtos=>mapper.mapArray<ResponseCartDTO,CarrelloModel>(dtos,'ResponseCartDTO','CarrelloModel')))
                .subscribe({
                    next:(carrello:CarrelloModel[])=>{
                        this.wishlist=carrello;

                    },
                    error:(err)=>{
                        console.log("Errore ottenimento carrello: "+err)
                    }
                });

        }
        else{
            this.router.navigate(['/']);
        }
    }
    rimuovi(id:string|undefined){
        if(id){
            this.carrelloService.removeItemFromCart(id).subscribe({
                next:(res)=>{
                    console.log("Prodotto rimosso");
                    this.wishlist.find(item=>item.prodotto.id==id);
                    this.wishlist=this.wishlist.filter(c=>c.prodotto.id!==id);
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

    moveToCart(item:CarrelloModel){
        const cartItem:UpdateCartItemDTO={
            prodottoId:item.prodotto.id,
            quantita:item.quantita,
            wishlist:false
        };
        if(item.prodotto.id){
            this.carrelloService.updateItemInCart(cartItem)
                .subscribe({
                    next:(res)=>{
                        const index = this.wishlist.findIndex(
                            cartElement => cartElement.prodotto.id === item.prodotto.id
                        );

                        if (index !== -1) {
                            this.wishlist.splice(index, 1);
                            console.log("Variabile 'carrello' locale aggiornata");
                        }
                    },
                    error:(err)=>{
                        console.log("Errore aggiornamento carrello: "+err);
                    }
                })
        }
    }

}
