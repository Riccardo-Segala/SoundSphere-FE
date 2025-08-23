import {ProdottoModel} from "./prodotto.model";

export interface CarrelloModel{
    prodotto: ProdottoModel;
    quantita: number;
    wishlist: boolean;
}