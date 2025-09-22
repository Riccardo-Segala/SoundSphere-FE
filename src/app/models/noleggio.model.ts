import {DettaglioNoleggioModel} from "./dettaglio-noleggio.model";

export interface NoleggioModel{
    id:string;
    dataInizio:string;
    dataScadenza:string;
    dataRestituzione:string;
    dataPagamento:string;
    totale:number;
    dettagli:[DettaglioNoleggioModel];
}