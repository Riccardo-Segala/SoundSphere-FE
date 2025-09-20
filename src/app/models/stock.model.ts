import {ProdottoModel} from "./prodotto.model";

export interface StockModel{
    filialeId:string;
    filialeNome:string;
    prodotto:ProdottoModel;
    quantita:number;
    quantitaAggiornata:number;
    quantitaPerNoleggio:number;
    quantitaNoleggioAggiornata:number;
}