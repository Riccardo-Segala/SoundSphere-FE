import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {
    ProdottoControllerService,
    ResponseProductDTO,
    CarrelloControllerService,
    ResponseUserDTO,
    UtenteControllerService,
    UpdateCartItemDTO
} from "../../api-client";
import {CommonModule,Location} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RecensioniComponent} from "../recensioni/recensioni.component";

@Component({
    selector: "app-dettaglio",
    standalone: true,
    imports: [CommonModule, FormsModule, RecensioniComponent],
    templateUrl: "/dettaglio-prodotto.component.html",
    styleUrls: ["/dettaglio-prodotto.component.scss"],
})

export class DettaglioProdottoComponent implements OnInit {
    prodotto:ResponseProductDTO={};
    quantita:number=0;
    errore:string="";
    user:ResponseUserDTO={};

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
            this.prodottoService.getProductById(id).subscribe(prodotto=>this.prodotto = prodotto);
        }
        const u=this.session.getUser();
        if(u)
            this.user=this.session.getUser() as ResponseUserDTO;
    }

    addToWishlist(){
        const prodId=this.route.snapshot.paramMap.get("id");
        if(!prodId){
            this.errore="Nessun prodotto è attualmente selezionato (manca id)";
            return;
        }
        else {
            this.errore="";
            const cartItem:UpdateCartItemDTO={
                prodottoId:prodId,
                quantita:this.quantita,
                wishlist:true
            };
            this.cartService.updateItemInCart(cartItem).subscribe({
                next:(response)=>{
                    if(response){
                        this.location.back();
                    }
                },
                error:()=>{
                    this.errore="Errore nell'inserimento del prodotto nel carrello";
                }
            })
        }
    }

    addToCart(){
        const prodId=this.route.snapshot.paramMap.get("id");
        if(!prodId){
            this.errore="Nessun prodotto è attualmente selezionato (manca id)";
            return;
        }
        else {
            this.errore="";
            const cartItem:UpdateCartItemDTO={
                prodottoId:prodId,
                quantita:this.quantita,
                wishlist:false
            };
            this.cartService.updateItemInCart(cartItem).subscribe({
                next:(response)=>{
                    if(response){
                        this.location.back();
                    }
                },
                error:()=>{
                    this.errore="Errore nell'inserimento del prodotto nel carrello";
                }
            })
        }
    }
    annulla(){
        this.location.back();
    }
}