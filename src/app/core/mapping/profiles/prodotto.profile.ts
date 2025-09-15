import {createMap,forMember,mapFrom} from '@automapper/core';
import type {Mapper} from '@automapper/core';
import {CreateProductDTO,ResponseProductDTO,UpdateProductDTO} from "../../../api-client";
import {ProdottoModel} from "../../../models/prodotto.model";

export const prodottoProfile = (mapper:Mapper)=>{
    createMap(mapper,'ResponseProductDTO','ProdottoModel');
    createMap(mapper,'CatalogProductDTO','ProdottoModel');
    createMap(mapper,'ProdottoModel','UpdateProductDTO',
        forMember(
            (destination:UpdateProductDTO)=>destination.categorieIds,
            mapFrom((source:ProdottoModel)=>source.categorie?.map(cat=>cat.id))
        ));
    createMap(mapper,'ProdottoModel','CreateProductDTO',forMember(
        (destination:UpdateProductDTO)=>destination.categorieIds,
        mapFrom((source:ProdottoModel)=>source.categorie?.map(cat=>cat.id))
    ));
}