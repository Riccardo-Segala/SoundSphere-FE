import {ProdottoModel} from "./prodotto.model";

export interface DettaglioNoleggioModel{
    noleggioId?: string;
    prodotto?: ProdottoModel;
    quantita?: number;
}