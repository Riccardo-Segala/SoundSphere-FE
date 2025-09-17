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
        pathImmagine: String,
        rentable:Boolean,
        costoGiornaliero:Number,
        categorie:['ResponseCategoryDTO']
    });
    PojosMetadataMap.create('UpdateProductDTO',{
        nome: String,
        descrizione: String,
        prezzo: Number,
        marca:String,
        rentable: Boolean,
        costoGiornaliero: Number,
        pathImmagine: String,
        categorieIds:[String]
    });
    PojosMetadataMap.create('CreateProductDTO',{
        nome: String,
        descrizione: String,
        prezzo: Number,
        marca: String,
        rentable: Boolean,
        costoGiornaliero: Number,
        pathImmagine: String,
        categorieIds:[String]
    });
    PojosMetadataMap.create('CatalogProductDTO',{
        id:String,
        nome:String,
        marca:String,
        prezzo:Number,
        costoGiornaliero:Number,
        pathImmagine:String,
        stelleMedie:Number,
        quantitaDisponibile: Number,
        quantitaDisponibileAlNoleggio: Number
    })
    PojosMetadataMap.create('ProdottoModel',{
        id:String,
        nome:String,
        descrizione:String,
        marca:String,
        prezzo:Number,
        costoGiornaliero:Number,
        rentable:Boolean,
        pathImmagine:String,
        stelleMedie:Number,
        quantitaDisponibile: Number,
        quantitaDisponibileAlNoleggio: Number,
        categorie:['CategoriaModel']
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
        main:Boolean,
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
        main:Boolean,
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
        main:Boolean,
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
        main:Boolean,
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
        id:String,
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
        vantaggio:'VantaggioModel',
        ruoli:['RuoloModel'],
        stipendio:Number,
        scadenzaContratto:String,
        dataAssunzione:String,
        filialeId:String
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
        id:String,
        nome:String,
        cognome:String,
        email:String,
        dataDiNascita:String,
        pathImmagine:String,
        sesso:String,
        tipologia:String,
        dataRegistrazione:String,
        punti:Number,
        vantaggio:'VantaggioModel',
        ruoli:[String]
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
    PojosMetadataMap.create('ResponseCategoryDTO',{
        id:String,
        name:String,
        slug:String,
        parent:'ResponseParentCategoryDTO'
    })
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
        isLeaf:Boolean,
        parent:'CategoriaModel'
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
    PojosMetadataMap.create('MetodoPagamentoModel',{
        id: String,
        nomeSuCarta: String,
        numero: String,
        cvv: String,
        dataScadenza: String,
        paypalEmail: String,
        tipoPagamento: String,
        main: Boolean
    });
    PojosMetadataMap.create('UpdatePaymentMethodDTO',{
        id: String,
        nomeSuCarta: String,
        numero: String,
        cvv: String,
        dataScadenza: String,
        paypalEmail: String,
        tipoPagamento: String,
        main: Boolean
    });
    PojosMetadataMap.create('ResponsePaymentMethodDTO',{
        id: String,
        nomeSuCarta: String,
        numero: String,
        dataScadenza: String,
        paypalEmail: String,
        tipoPagamento: String,
        main: Boolean
    });
    PojosMetadataMap.create('CreatePaymentMethodDTO',{
        nomeSuCarta: String,
        numero: String,
        cvv: String,
        dataScadenza: String,
        paypalEmail: String,
        tipoPagamento: String,
        main: Boolean,
        utenteId:String
    });
    PojosMetadataMap.create('CreateUserFromAdminDTO',{
        nome: String,
        cognome: String,
        email:String,
        password:String,
        dataDiNascita: String,
        pathImmagine:String,
        sesso:String,
        vantaggioId:String,
        ruoliIds:[String]
    });
    PojosMetadataMap.create('ResponseEmployeeDTO',{
        id:String,
        nome: String,
        cognome: String,
        email:String,
        dataDiNascita: String,
        tipologia:String,
        pathImmagine:String,
        sesso:String,
        dataRegistrazione:String,
        stipendio:Number,
        scadenzaContratto:String,
        dataAssunzione:String,
        filialeId:String,
        ruoli:[String]
    });
    PojosMetadataMap.create('UpdateEmployeeDTO',{
        stipendio:Number,
        scadenzaContratto:String,
        dataAssunzione:String,
        filialeId:String
    });
    PojosMetadataMap.create('UpdateEmployeeFromAdminDTO',{
        nome: String,
        cognome: String,
        email:String,
        password:String,
        dataDiNascita: String,
        tipologia:String,
        pathImmagine:String,
        sesso:String,
        stipendio:Number,
        scadenzaContratto:String,
        dataAssunzione:String,
        filialeId:String,
        ruoliIds:[String]
    });
    PojosMetadataMap.create('UpdateUserFromAdminDTO',{
        nome: String,
        cognome: String,
        email:String,
        password:String,
        dataDiNascita: String,
        pathImmagine:String,
        sesso:String,
        punti:Number,
        vantaggioId:String,
        ruoliIds:[String]
    })
    PojosMetadataMap.create('CreateEmployeeDTO',{
        utente:'CreateUserDTO',
        stipendio:Number,
        scadenzaContratto:String,
        dataAssunzione:String,
        filialeId:String,
    });
    PojosMetadataMap.create('CreateEmployeeFromAdminDTO',{
        utente:'CreateUserFromAdminDTO',
        stipendio:Number,
        scadenzaContratto:String,
        dataAssunzione:String,
        filialeId:String
    });
    PojosMetadataMap.create('FilialeModel',{
        id: String,
        nome: String,
        telefono: String,
        email: String,
        via: String,
        citta:String,
        cap: String,
        provincia: String,
        nazione: String
    });
    PojosMetadataMap.create('BranchAddressDTO',{
        via: String,
        citta:String,
        cap: String,
        provincia: String,
        nazione: String
    });
    PojosMetadataMap.create('ResponseBranchDTO',{
        id: String,
        nome: String,
        telefono: String,
        email: String,
        indirizzo:'BranchAddressDTO'
    });
    PojosMetadataMap.create('CreateBranchDTO',{
        nome: String,
        telefono: String,
        email: String,
        via: String,
        citta:String,
        cap: String,
        provincia: String,
        nazione: String
    });
    PojosMetadataMap.create('UpdateBranchDTO',{
        id: String,
        nome: String,
        telefono: String,
        email: String,
        via: String,
        citta:String,
        cap: String,
        provincia: String,
        nazione: String
    });
    PojosMetadataMap.create('ResponsePermissionDTO',{
        id:String,
        nome:String
    });
    PojosMetadataMap.create('PermessoModel',{
        id:String,
        nome:String
    });
    PojosMetadataMap.create('ResponseRoleDTO',{
        id:String,
        nome:String,
        permessi:['ResponsePermissionDTO']
    });
    PojosMetadataMap.create('RuoloModel',{
        id:String,
        nome:String,
        permessi:['PermessoModel']
    });
    PojosMetadataMap.create('CreateRoleDTO',{
        nome:String,
        permessiIds:[String]
    });
    PojosMetadataMap.create('UpdateRoleDTO',{
        nome:String,
        permessiIds:[String]
    });
    PojosMetadataMap.create('ResponseStaticDataDTO',{
        id:String,
        nome:String,
        valore:Number
    });
    PojosMetadataMap.create('CreateOrUpdateStaticDataDTO',{
        nome:String,
        valore:Number
    });
    PojosMetadataMap.create('DatiStaticiModel',{
        id:String,
        nome:String,
        valore:Number
    });
}