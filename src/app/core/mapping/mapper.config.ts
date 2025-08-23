import { pojos,PojosMetadataMap } from '@automapper/pojos';

export function setupMapperMetadata():void{
    PojosMetadataMap.create('ResponseProductDTO',{
        id: String,
        nome: String,
        descrizione: String,
        prezzo: Number,
        marca: String,
        pathImmagine: String
    });
    PojosMetadataMap.create('UpdateProductDTO',{
        id: String,
        nome: String,
        descrizione: String,
        prezzo: Number,
        isRentable: Boolean,
        costoGiornaliero: Number,
        pathImmagine: String
    });
    PojosMetadataMap.create('CreateProductDTO',{
        nome: String,
        descrizione: String,
        prezzo: Number,
        marca: String,
        isRentable: Boolean,
        costoGiornaliero: Number,
        pathImmagine: String
    });
    PojosMetadataMap.create('ProdottoModel',{
        id:String,
        nome:String,
        descrizione:String,
        marca:String,
        prezzo:Number,
        costoGiornaliero:Number,
        isRentable:Boolean,
        pathImmagine:String
    });

    PojosMetadataMap.create('ResponseCartDTO',{
        prodotto:'ResponseProductDTO',
        quantita:Number,
        wishlist:Boolean
    });
    PojosMetadataMap.create('UpdateCartItemDTO',{
        prodottoId:String,
        quantita:Number,
        wishlist:Boolean
    });
    PojosMetadataMap.create('CarrelloModel',{
        prodotto:'ProdottoModel',
        quantita:Number,
        wishlist:Boolean
    });
}