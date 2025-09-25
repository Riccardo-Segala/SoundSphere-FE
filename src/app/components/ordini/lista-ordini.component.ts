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
        if (!dataScadenza) {
            return 'badge-status-secondary';
        }

        // Normalizza le date per confrontare solo i giorni, ignorando l'orario.
        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0);

        const dataScad = new Date(dataScadenza);
        dataScad.setHours(0, 0, 0, 0);

        // 2. Logica per i noleggi già restituiti
        if (dataRestituzione) {
            const dataRest = new Date(dataRestituzione);
            dataRest.setHours(0, 0, 0, 0);

            // Confronta la data di restituzione con quella di scadenza.
            return dataRest.getTime() > dataScad.getTime()
                ? 'badge-status-consegnato-in-ritardo'
                : 'badge-status-consegnato-in-tempo';
        }

        // 3. Logica per i noleggi non ancora restituiti
        if (dataScad.getTime() < oggi.getTime()) {
            // È in ritardo. Controlliamo da quanto tempo.
            const settimanaFa = new Date();
            settimanaFa.setHours(0, 0, 0, 0);
            settimanaFa.setDate(oggi.getDate() - 7);

            // Se la scadenza è precedente a una settimana fa, è "molto in ritardo".
            return dataScad.getTime() < settimanaFa.getTime()
                ? 'badge-status-secondary' // Come da tua richiesta per ritardi > 7gg
                : 'badge-status-ritardo';
        } else {
            // Non è in ritardo, la scadenza è oggi o nel futuro.
            const traUnaSettimana = new Date();
            traUnaSettimana.setHours(0, 0, 0, 0);
            traUnaSettimana.setDate(oggi.getDate() + 7);

            // Se la scadenza è entro i prossimi 7 giorni.
            return dataScad.getTime() < traUnaSettimana.getTime()
                ? 'badge-status-manca-una-settimana-a-scadenza'
                : 'badge-status-in-tempo'; // Default per scadenze future oltre la settimana
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