import {Component, OnInit} from "@angular/core";
import {UtenteModel} from "../../models/utente.model";
import {StockModel} from "../../models/stock.model";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {
    AdminFilialeControllerService,
    AdminStockControllerService,
    ResponseBranchDTO,
    ResponseStockDTO, UpdateStockFromAdminDTO
} from "../../api-client";
import {StockComponent} from "../stock/stock.component";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {FilialeModel} from "../../models/filiale.model";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector:'app-admin-stock',
    standalone:true,
    imports: [
        NgForOf,
        FormsModule,
        NgIf
    ],
    templateUrl:'admin-stock.component.html',
    styleUrls:['admin-stock.component.scss']
})
export class AdminStockComponent implements OnInit{
    loggedUser:UtenteModel|null=null;
    stocks:StockModel[]=[];
    stocksFiltrati:StockModel[]=[];
    filiali:FilialeModel[]=[];
    filialeSelezionata:FilialeModel|null=null;
    checked:boolean=false;
    stringaFiltro:string="";

    constructor(
        private router:Router,
        private session:SessionService,
        private adminStockService:AdminStockControllerService,
        private adminFilialeService:AdminFilialeControllerService
    ) {
    }

    ngOnInit() {
        this.loggedUser=this.session.getUser();
        if(this.loggedUser && this.loggedUser.ruoli?.map(ruolo=>ruolo.nome).includes("ADMIN")){
            this.adminStockService.getAllStock()
                .pipe(map(dtos=>mapper.mapArray<ResponseStockDTO,StockModel>(dtos,'ResponseStockDTO','StockModel')))
                .subscribe({
                    next:(res:StockModel[])=>{
                        this.stocks=res;
                        this.stocksFiltrati=this.stocks;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento stock: ",JSON.stringify(err));
                    }
                });
            this.adminFilialeService.getAllBranches()
                .pipe(map(dtos=>mapper.mapArray<ResponseBranchDTO,FilialeModel>(dtos,'ResponseBranchDTO','FilialeModel')))
                .subscribe({
                    next:(res:FilialeModel[])=>{
                        this.filiali=res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento filiali: ",JSON.stringify(err));
                    }
                })
        }
        else{
            this.router.navigate(["/"])
        }
    }

    filtra(){
        if(this.filialeSelezionata){
            this.stocksFiltrati=this.stocks.filter(stock=>stock.filialeId===this.filialeSelezionata?.id);
        }
        else{
            this.stocksFiltrati=this.stocks;
        }

        if(this.checked){
            this.stocksFiltrati=this.stocksFiltrati.filter(stock=>stock.quantita!==stock.quantitaAggiornata || stock.quantitaPerNoleggio!==stock.quantitaNoleggioAggiornata);
        }

        if(this.stringaFiltro!==""){
            //cerca sia su nome che marca del prodotto
            this.stocksFiltrati=this.stocksFiltrati.filter(stock=>
                stock.prodotto.nome?.toLowerCase().includes(this.stringaFiltro.toLowerCase()) ||
                stock.prodotto.marca?.toLowerCase().includes(this.stringaFiltro.toLowerCase()))
        }
    }

    decrementa(prodottoId:string|undefined,filialeId:string){
        if(prodottoId){
            const stock=this.stocksFiltrati.find(s=>s.filialeId===filialeId && s.prodotto.id===prodottoId);
            if(stock){
                stock.quantita-=1;
            }
        }
    }
    incrementa(prodottoId:string|undefined,filialeId:string){
        if(prodottoId){
            const stock=this.stocksFiltrati.find(s=>s.filialeId===filialeId && s.prodotto.id===prodottoId);
            if(stock){
                stock.quantita+=1;
            }
        }
    }
    decrementaNoleggio(prodottoId:string|undefined,filialeId:string){
        if(prodottoId){
            const stock=this.stocksFiltrati.find(s=>s.filialeId===filialeId && s.prodotto.id===prodottoId);
            if(stock){
                stock.quantitaPerNoleggio-=1;
            }
        }
    }
    incrementaNoleggio(prodottoId:string|undefined,filialeId:string){
        if(prodottoId){
            const stock=this.stocksFiltrati.find(s=>s.filialeId===filialeId && s.prodotto.id===prodottoId);
            if(stock){
                stock.quantitaPerNoleggio+=1;
            }
        }
    }

    salva(prodottoId:string|undefined,filialeId:string){
        const stockDaAggiornare:StockModel|undefined=this.stocks.find(s=>s.filialeId===filialeId && s.prodotto.id===prodottoId);
        if(stockDaAggiornare){
            const index=this.stocks.indexOf(stockDaAggiornare);
            this.adminStockService.updateStock(mapper.map(stockDaAggiornare,'StockModel','UpdateStockFromAdminDTO'))
                .pipe(map(dto=>mapper.map<ResponseStockDTO,StockModel>(dto,'ResponseStockDTO','StockModel')))
                .subscribe({
                    next:(res:StockModel)=>{
                        this.stocks[index]=res;
                        this.filtra();
                    },
                    error:(err)=>{
                        console.log("Errore aggiornamento stock: ",JSON.stringify(err));
                    }
                });
        }
    }
}