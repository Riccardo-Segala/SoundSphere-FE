export interface IndirizzoUtenteModel{
    id?:string;
    via?:string;
    civico?:string;
    cap?:string;
    citta?:string;
    provincia?:string;
    nazione?:string;
    isDefault?:boolean;
    tipologia?:"SPEDIZIONE";
    utenteId?:string;
    utenteNome?:string;
    utenteCognome?:string;
}