import {createMap,forMember,mapFrom} from '@automapper/core';
import type {Mapper} from '@automapper/core';
import {UpdateCartItemDTO, ResponseCartDTO, ResponseProductDTO} from "../../../api-client";
import {CarrelloModel} from "../../../models/carrello.model"
import {ProdottoModel} from "../../../models/prodotto.model";

export const carrelloProfile =(mapper:Mapper)=>{
    createMap(mapper,'ResponseCartDTO','CarrelloModel',
        forMember(
            (destination:CarrelloModel)=>destination.prodotto,
            mapFrom((source:ResponseCartDTO)=>
                source.prodotto
                ? mapper.map<ResponseProductDTO,ProdottoModel>(source.prodotto,'ResponseProductDTO','ProdottoModel')
                : null
            )
        )
    );
    createMap(mapper,'CarrelloModel','UpdateCartItemDTO',
        forMember(
            (destination:UpdateCartItemDTO) => destination.prodottoId,
            mapFrom((source:CarrelloModel) => source.prodotto?.id)
        )
    );
}