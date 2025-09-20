import {CategoriaModel} from "./categoria.model";

export interface ProdottoModel{
    id?:string;
    nome?:string;
    descrizione?:string;
    marca?:string;
    prezzo?:number;
    quantitaDisponibile?:number;
    costoGiornaliero?:number;
    quantitaDisponibileAlNoleggio?:number;
    rentable?:boolean;
    pathImmagine?:string;
    stelleMedie?:number;
    categorie?:CategoriaModel[];
}