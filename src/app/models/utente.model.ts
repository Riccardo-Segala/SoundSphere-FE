import {VantaggioModel} from "./vantaggio.model";

export interface UtenteModel{
    id?:string;
    nome?:string;
    cognome?:string;
    email?:string;
    password?:string;
    dataDiNascita?:string;
    pathImmagine?:string;
    sesso?:SessoEnum;
    tipologia?:string;
    dataRegistrazione?:string;
    punti?:number;
    vantaggio?:VantaggioModel;
    ruoli?:string[];
    ruoliIds?:string[];
    stipendio?:number;
    scadenzaContratto?:string;
    dataAssunzione?:string;
    filialeId?:string;
}

export const SessoEnum = {
    Maschio: 'MASCHIO',
    Femmina: 'FEMMINA',
    NonSpecificato: 'NON_SPECIFICATO'
} as const;
export type SessoEnum = typeof SessoEnum[keyof typeof SessoEnum];