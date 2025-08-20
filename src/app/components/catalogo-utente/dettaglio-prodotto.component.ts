import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {
    CreateCartDTO,
    ProdottoControllerService,
    ResponseProductDTO,
    CarrelloControllerService,
    ResponseUserDTO,
    UtenteControllerService
} from "../../api-client";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: "app-dettaglio",
    standalone: true,
    imports:[CommonModule,FormsModule],
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
                private userService:UtenteControllerService) {
    }

    ngOnInit() {
        const id=this.route.snapshot.paramMap.get("id");
        if(id){
            this.prodottoService.getProductById(id).subscribe(prodotto=>this.prodotto = prodotto);
        }

        this.userService.getCurrentUser().subscribe(user=>this.user = user);
    }

    addToWishlist(){

    }

    addToCart(){
        if(this.quantita==0){
            this.errore="Selezionare una quantità maggiore di 0";
            return;
        }
        const prodId=this.route.snapshot.paramMap.get("id");
        if(!prodId){
            this.errore="Nessun prodotto è attualmente selezionato (manca id)";
            return;
        }
        else {
            this.errore="";
            const carrello:CreateCartDTO={
                utenteId:this.user.id,
                prodottoId:prodId,
                quantita:this.quantita,
                wishlist:false
            };
            this.cartService.createCart(carrello).subscribe({
                next:(response)=>{
                    if(response){
                        this.router.navigate(['/']);
                    }
                },
                error:()=>{
                    this.errore="Errore nell'inserimento del prodotto nel carrello";
                }
            })
        }
    }
}