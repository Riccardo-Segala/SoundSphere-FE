import {Component, OnInit} from "@angular/core";
import {CommonModule, NgForOf} from '@angular/common';
import {
    CarrelloControllerService, ProdottoControllerService, ResponseCartDTO,
    ResponseUserDTO,
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
    quantita:number=1;

    constructor(
        private session:SessionService,
        private router:Router,
        private route:ActivatedRoute,
        private http:HttpClient,
        private userService:UtenteControllerService,
        private carrelloService:CarrelloControllerService,
        private prodottoService:ProdottoControllerService
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
    checkout(){
        this.router.navigate(["/checkout"]);
    }
}