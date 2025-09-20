import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {DettaglioOrdineModel} from "../../../models/dettaglio-ordine.model";
import {ResponseOrderDetailsDTO, ResponseOrderDTO, ResponseProductDTO} from "../../../api-client";
import {ProdottoModel} from "../../../models/prodotto.model";
import {OrdineModel} from "../../../models/ordine.model";

export const ordineProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponseOrderDetailsDTO','DettaglioOrdineModel',
        forMember(
            (destination:DettaglioOrdineModel)=>destination.prodotto,
            mapFrom((source:ResponseOrderDetailsDTO)=>
                source.prodotto
                    ? mapper.map<ResponseProductDTO,ProdottoModel>(source.prodotto,'ResponseProductDTO','ProdottoModel')
                    : undefined
        ))
    );
    createMap(mapper,'ResponseOrderDTO','OrdineModel',
        forMember(
            (destination:OrdineModel)=>destination.dettagli,
            mapFrom((source:ResponseOrderDTO)=>
                source.dettagli
                    ? mapper.mapArray<ResponseOrderDetailsDTO,DettaglioOrdineModel>(source.dettagli,'ResponseOrderDetailsDTO','DettaglioOrdineModel')
                    : undefined
            ))
    );

}