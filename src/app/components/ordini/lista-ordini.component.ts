import {Component, OnInit} from "@angular/core";
import {OrdineModel} from "../../models/ordine.model";
import {SessionService} from "../../services/session.service";
import {Router} from "@angular/router";
import {OrdineControllerService, ResponseOrderDTO} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector:'app-ordini',
    standalone:true,
    imports: [
        NgForOf,
        NgIf
    ],
    templateUrl:'lista-ordini.component.html',
    styleUrls:['lista-ordini.component.scss']
})
export class ListaOrdiniComponent implements OnInit{
    ordini:OrdineModel[]=[]
    loggedUser:UtenteModel|null=null;

    constructor(
        private session:SessionService,
        private router:Router,
        private ordineService:OrdineControllerService
    ) {
    }

    ngOnInit() {
        this.loggedUser=this.session.getUser();
        if(this.loggedUser){
            this.ordineService.getMyOrders()
                .pipe(map(dtos=>mapper.mapArray<ResponseOrderDTO,OrdineModel>(dtos,'ResponseOrderDTO','OrdineModel')))
                .subscribe({
                    next:(res:OrdineModel[])=>{
                        this.ordini=res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento ordini: ",JSON.stringify(err));
                    }
                })
        }else{
            this.router.navigate(['/']);
        }
    }
}