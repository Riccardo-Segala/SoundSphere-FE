import { pojos,PojosMetadataMap } from '@automapper/pojos';
import {VantaggioModel} from "../../models/vantaggio.model";
import {CreateUserDTO, UpdateUserAddressDTO, UpdateUserDTO} from "../../api-client";

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
        pathImmagine:String,
        numStelleMedio:Number
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
    PojosMetadataMap.create('IndirizzoUtenteModel',{
        id:String,
        via:String,
        civico:String,
        cap:String,
        citta:String,
        provincia:String,
        nazione:String,
        idDefault:Boolean,
        tipologia:"SPEDIZIONE",
        utenteId:String,
        utenteNome:String,
        utenteCognome:String
    });
    PojosMetadataMap.create('CreateUserAddressDTO',{
        via:String,
        civico:String,
        cap:String,
        citta:String,
        provincia:String,
        nazione:String,
        idDefault:Boolean,
        tipologia:"SPEDIZIONE",
        utenteId:String,
        utenteNome:String,
        utenteCognome:String
    });
    PojosMetadataMap.create('UpdateUserAddressDTO',{
        id:String,
        via:String,
        civico:String,
        cap:String,
        citta:String,
        provincia:String,
        nazione:String,
        idDefault:Boolean,
        tipologia:"SPEDIZIONE"
    });
    PojosMetadataMap.create('ResponseUserAddressDTO',{
        id:String,
        via:String,
        civico:String,
        cap:String,
        citta:String,
        provincia:String,
        nazione:String,
        idDefault:Boolean,
        tipologia:"SPEDIZIONE"
    });
    PojosMetadataMap.create('ResponseBenefitDTO',{
        id: String,
        nome: String,
        sconto: Number,
        punteggioMinimo: Number,
        punteggioMassimo: Number
    });
    PojosMetadataMap.create('UpdateBenefitDTO',{
        id: String,
        nome: String,
        sconto: Number,
        punteggioMinimo: Number,
        punteggioMassimo: Number
    });
    PojosMetadataMap.create('CreateBenefitDTO',{
        nome: String,
        sconto: Number,
        punteggioMinimo: Number,
        punteggioMassimo: Number
    });
    PojosMetadataMap.create('VantaggioModel',{
        id: String,
        nome: String,
        sconto: Number,
        punteggioMinimo: Number,
        punteggioMassimo: Number
    });
    PojosMetadataMap.create('UtenteModel',{
        nome:String,
        cognome:String,
        email:String,
        password:String,
        dataDiNascita:String,
        pathImmagine:String,
        sesso:String,
        tipologia:String,
        dataRegistrazione:String,
        punti:Number,
        vantaggio:'VantaggioModel'
    });
    PojosMetadataMap.create('UpdateUserDTO',{
        nome:String,
        cognome:String,
        password:String,
        dataDiNascita:String,
        pathImmagine:String,
        sesso:String,
    });
    PojosMetadataMap.create('ResponseUserDTO',{
        nome:String,
        cognome:String,
        email:String,
        dataDiNascita:String,
        pathImmagine:String,
        sesso:String,
        tipologia:String,
        dataRegistrazione:String,
        punti:Number,
        vantaggio:'VantaggioModel'
    });
    PojosMetadataMap.create('CreateUserDTO',{
        nome:String,
        cognome:String,
        email:String,
        password:String,
        dataDiNascita:String,
        pathImmagine:String,
        sesso:String
    });
    PojosMetadataMap.create('ResponseParentCategoryDTO',{
        id:String,
        name:String,
        slug:String
    });
    PojosMetadataMap.create('ResponseCategoryNavigationDTO',{
        id:String,
        name:String,
        slug:String,
        children:['ResponseParentCategoryDTO'],
        isLeaf:Boolean
    });
    PojosMetadataMap.create('CategoriaModel',{
        id:String,
        name:String,
        slug:String,
        children:['CategoriaModel'],
        isLeaf:Boolean
    });
    PojosMetadataMap.create('ResponseReviewDTO',{
        prodottoId:String,
        data: String,
        numStelle: Number,
        titolo: String,
        descrizione: String,
        nomeProdotto: String,
        nomeUtente: String,
        cognomeUtente: String
    });
    PojosMetadataMap.create('UpdateReviewDTO',{
        numStelle: Number,
        titolo: String,
        descrizione: String
    });
    PojosMetadataMap.create('CreateReviewDTO',{
        prodottoId:String,
        numStelle: Number,
        titolo: String,
        descrizione: String
    });
    PojosMetadataMap.create('RecensioneModel',{
        prodottoId:String,
        data: String,
        numStelle: Number,
        titolo: String,
        descrizione: String,
        nomeUtente: String,
        cognomeUtente: String
    });
}