import {ResponseOrderDetailsDTO} from "../api-client";

export interface OrdineModel{
    id?: string;
    dataAcquisto?: string;
    dataConsegna?: string;
    spedizioneGratuita?: boolean;
    totale?: number;
    stato?: OrderModel.StatoEnum;
    dettagli?: Array<ResponseOrderDetailsDTO>;
}

export namespace OrderModel {
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