import {createMap,forMember,mapFrom} from '@automapper/core';
import type {Mapper} from '@automapper/core';
import {UpdateCartItemDTO,ResponseCartDTO} from "../../../api-client";
import {CarrelloModel} from "../../../models/carrello.model"

export const carrelloProfile =(mapper:Mapper)=>{
    createMap(mapper,'ResponseCartDTO','CarrelloModel',
        forMember(
            (destination)=>destination.prodotto,
            mapFrom((source)=>mapper.map(source.prodotto,'ResponseProductDTO','ProdottoModel'))
        ));
    createMap(mapper,'CarrelloModel','UpdateCartItemDTO',
        forMember(
            (destination) => destination.prodottoId,
            mapFrom((source) => source.prodotto.id)
        )
    );
}