import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../services/session.service";
import {Router} from "@angular/router";
import {
    ResponseStockDTO,
    StockControllerService, UpdateStockDTO
} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {StockModel} from "../../models/stock.model";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {FilialeModel} from "../../models/filiale.model";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector:'app-stock',
    standalone:true,
    imports: [
        NgForOf,
        FormsModule
    ],
    templateUrl:'stock.component.html',
    styleUrls:['stock.component.scss']
})
export class StockComponent implements OnInit{
    loggedUser:UtenteModel|null=null;
    stockFiliale:StockModel[]=[];

    constructor(
        private session:SessionService,
        private router:Router,
        private stockService:StockControllerService
    ) {
    }

    ngOnInit() {
        this.loggedUser=this.session.getUser();
        if(this.loggedUser && this.loggedUser.ruoli?.map(ruolo=>ruolo.nome).includes("DIPENDENTE")){
            this.stockService.getMyFilialeStock()
                .pipe(map(dtos=>mapper.mapArray<ResponseStockDTO,StockModel>(dtos,'ResponseStockDTO','StockModel')))
                .subscribe({
                    next:(res:StockModel[])=>{
                        this.stockFiliale=res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento stock filiale: ",JSON.stringify(err));
                    }
                })
        }
        else{
            this.router.navigate(['/']);
        }
    }

    decrementa(id:string|undefined){
        if(id){
            const stockDaDecrementare=this.stockFiliale.find(s=>s.prodotto.id===id);
            if(stockDaDecrementare){
                stockDaDecrementare.quantita-=1;
            }
        }
    }
    incrementa(id:string|undefined){
        if(id){
            const stockDaIncrementare=this.stockFiliale.find(s=>s.prodotto.id===id);
            if(stockDaIncrementare){
                stockDaIncrementare.quantita+=1;
            }
        }
    }

    salva(id:string|undefined){
        if(id){
            const stockDaAggiornare:StockModel|undefined=this.stockFiliale.find(s=>s.prodotto.id===id);
            if(stockDaAggiornare){
                const index=this.stockFiliale.indexOf(stockDaAggiornare);
                this.stockService.updateMyFilialeStock(mapper.map(stockDaAggiornare,'StockModel','UpdateStockDTO'))
                    .pipe(map(dto=>mapper.map<ResponseStockDTO,StockModel>(dto,'ResponseStockDTO','StockModel')))
                    .subscribe({
                        next:(res:StockModel)=>{
                            this.stockFiliale[index]=res;
                        },
                        error:(err)=>{
                            console.log("Errore aggiornamento stock: ",JSON.stringify(err));
                        }
                    })
            }
        }
    }
}