import {ResponseOrderDetailsDTO, ResponseOrderDTO} from "../api-client";
import {DettaglioOrdineModel} from "./dettaglio-ordine.model";

export interface OrdineModel{
    id?: string;
    dataAcquisto?: string;
    dataConsegna?: string;
    spedizioneGratuita?: boolean;
    totale?: number;
    stato?: OrdineModel.StatoEnum;
    dettagli?: DettaglioOrdineModel[];
}

export namespace OrdineModel {
    export const StatoEnum = {
        InElaborazione: 'IN_ELABORAZIONE',
        Spedito: 'SPEDITO',
        InConsegna: 'IN_CONSEGNA',
        Consegnato: 'CONSEGNATO',
        InAttesa: 'IN_ATTESA',
        Annullato: 'ANNULLATO'
    } as const;
    export type StatoEnum = typeof StatoEnum[keyof typeof StatoEnum];
}