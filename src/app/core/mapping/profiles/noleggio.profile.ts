import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {DettaglioNoleggioModel} from "../../../models/dettaglio-noleggio.model";
import {ResponseProductDTO, ResponseRentalDetailsDTO, ResponseRentalDTO} from "../../../api-client";
import {ProdottoModel} from "../../../models/prodotto.model";
import {NoleggioModel} from "../../../models/noleggio.model";

export const noleggioProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponseRentalDetailsDTO','DettaglioNoleggioModel',
        forMember(
            (destination:DettaglioNoleggioModel)=>destination.prodotto,
            mapFrom((source:ResponseRentalDetailsDTO)=>
                source.prodotto
                    ? mapper.map<ResponseProductDTO,ProdottoModel>(source.prodotto,'ResponseProductDTO','ProdottoModel')
                    : undefined
            )
        )
    );
    createMap(mapper,'ResponseRentalDTO','NoleggioModel',
        forMember(
            (destination:NoleggioModel)=>destination.dettagli,
            mapFrom((source:ResponseRentalDTO)=>
                source.dettagli
                    ? mapper.mapArray<ResponseRentalDetailsDTO,DettaglioNoleggioModel>(source.dettagli,'ResponseRentalDetailsDTO','DettaglioNoleggioModel')
                    : undefined
            )
        )
    );
}