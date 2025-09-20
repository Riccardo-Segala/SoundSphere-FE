import {ProdottoModel} from "./prodotto.model";

export interface DettaglioOrdineModel{
    ordineId?: string;
    prodotto?: ProdottoModel;
    quantita?: number;
}