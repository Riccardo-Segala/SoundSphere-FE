import {createMap, defaultStrategyInitializerOptions, forMember, mapFrom, Mapper} from "@automapper/core";
import {mapper} from "../mapper.initializer";
import {ProdottoModel} from "../../../models/prodotto.model";
import {StockModel} from "../../../models/stock.model";
import {
    CreateStockDTO,
    ResponseProductDTO,
    ResponseStockDTO,
    UpdateStockDTO,
    UpdateStockFromAdminDTO
} from "../../../api-client";

export const stockProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponseStockDTO','StockModel',
        forMember(
            (destination:StockModel)=>destination.prodotto,
            mapFrom((source:ResponseStockDTO)=>
                source.prodotto
                ? mapper.map<ResponseProductDTO,ProdottoModel>(source.prodotto,'ResponseProductDTO','ProdottoModel')
                : null
        )),
        forMember(
            (destination:StockModel)=>destination.quantitaAggiornata,
            mapFrom((source:ResponseStockDTO)=>source.quantita)
        ),
        forMember(
            (destination:StockModel)=>destination.quantitaNoleggioAggiornata,
            mapFrom((source:ResponseStockDTO)=>source.quantitaPerNoleggio)
        ),
    );

    createMap(mapper,'StockModel','UpdateStockDTO',
        forMember(
            (destination:UpdateStockDTO)=>destination.prodottoId,
            mapFrom((source:StockModel)=>source.prodotto.id)
        ));

    createMap(mapper,'StockModel','CreateStockDTO',
        forMember(
            (destination:CreateStockDTO)=>destination.prodottoId,
            mapFrom((source:StockModel)=>source.prodotto.id)
        ));

    createMap(mapper,'StockModel','UpdateStockFromAdminDTO',
        forMember(
            (destination:UpdateStockFromAdminDTO)=>destination.prodottoId,
            mapFrom((source:StockModel)=>source.prodotto.id)
        ));
}