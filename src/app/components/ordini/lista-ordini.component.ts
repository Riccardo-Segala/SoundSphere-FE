import {Component, OnInit} from "@angular/core";
import {SessionService} from "../../services/session.service";
import {Router} from "@angular/router";
import {
    NoleggioControllerService,
    OrdineControllerService,
    ResponseOrderDTO,
    ResponseRentalDTO
} from "../../api-client";
import {OrdineModel} from "../../models/ordine.model";
import {UtenteModel} from "../../models/utente.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NoleggioModel} from "../../models/noleggio.model";

@Component({
    selector:'app-lista-ordini',
    standalone:true,
    imports: [
        NgForOf,
        NgIf,
        NgClass
    ],
    templateUrl:'lista-ordini.component.html',
    styleUrls:['lista-ordini.component.scss']
})
export class ListaOrdiniComponent implements OnInit{

    ordini:OrdineModel[]=[];
    noleggi:NoleggioModel[]=[];

    loggedUser:UtenteModel|null=null;

    constructor(
        private session:SessionService,
        private router:Router,
        private ordineService:OrdineControllerService,
        private noleggioService:NoleggioControllerService
    ){}


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
                });

            this.noleggioService.getMyRentals()
                .pipe(map(dtos=>mapper.mapArray<ResponseRentalDTO,NoleggioModel>(dtos,'ResponseRentalDTO','NoleggioModel')))
                .subscribe({
                    next:(res:NoleggioModel[])=>{
                        this.noleggi=res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento noleggi: ",JSON.stringify(err));
                    }
                });
        }
        else{
            this.router.navigate(['/']);
        }
    }

    getBadgeOrdineClass(stato:string|undefined):string{
        switch(stato){
            case 'CONSEGNATO': return 'badge-status-consegnato';
            case 'IN_CONSEGNA': return 'badge-status-in-consegna';
            case 'SPEDITO': return 'badge-status-spedito';
            case 'IN_ELABORAZIONE': return 'badge-status-in-elaborazione';
            case 'IN_ATTESA': return 'badge-status-in-attesa';
            case 'ANNULLATO': return 'badge-status-annullato';
            default: return 'badge-status-secondary';
        }
    }

    getBadgeNoleggioClass(dataScadenza:string|undefined,dataRestituzione:string|undefined):string{
        const oggi:Date=new Date();
        if(dataScadenza){
            const dataScad:Date=new Date(dataScadenza);
            if(dataRestituzione){
                const dataRest:Date=new Date(dataRestituzione);
                if(dataRest.getTime()>dataScad.getTime()){
                    return 'badge-status-consegnato-in-ritardo';
                }
                return 'badge-status-consegnato-in-tempo'
            }
            if(dataScad.getTime()<oggi.getTime()){
                return 'badge-status-ritardo';
            }
            const settimana:Date=new Date();
            settimana.setDate((oggi.getDate()+7))
            if(dataScad.getTime()<settimana.getTime()){
                return 'badge-status-manca-una-settimana-a-scadenza';
            }
            return 'badge-status-in-tempo';
        }else{
            return 'badge-status-secondary';
        }
    }

    prezzoDettaglio(prezzo:number|undefined):number{
        if(prezzo){
            return prezzo;
        }
        return 0;
    }
    prezzoTotaleDettaglio(prezzo:number|undefined,quantita:number|undefined,tipologia:string){
        if(prezzo && quantita){
            return prezzo*quantita;
        }
        return 0;
    }
}