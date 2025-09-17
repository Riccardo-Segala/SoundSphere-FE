import {createMap, forMember, mapFrom, undefinedSubstitution} from '@automapper/core';
import type {Mapper} from '@automapper/core';
import {CreateProductDTO, ResponseCategoryDTO, ResponseProductDTO, UpdateProductDTO} from "../../../api-client";
import {ProdottoModel} from "../../../models/prodotto.model";
import {CategoriaModel} from "../../../models/categoria.model";

export const prodottoProfile = (mapper:Mapper)=>{
    createMap(mapper,'ResponseProductDTO','ProdottoModel',
        forMember(
            (destination:ProdottoModel)=>destination.categorie,
            mapFrom((source:ResponseProductDTO)=>
                source.categorie
                    ? mapper.mapArray<ResponseCategoryDTO,CategoriaModel>(source.categorie,'ResponseCategoryDTO','CategoriaModel')
                    : undefined
            )
        ));
    createMap(mapper,'CatalogProductDTO','ProdottoModel');
    createMap(mapper,'ProdottoModel','UpdateProductDTO',
        forMember(
            (destination:UpdateProductDTO)=>destination.categorieIds,
            mapFrom((source:ProdottoModel)=>source.categorie?.map(categ=>categ.id))
        ));
    createMap(mapper,'ProdottoModel','CreateProductDTO',
        forMember(
            (destination:UpdateProductDTO)=>destination.categorieIds,
            mapFrom((source:ProdottoModel)=>source.categorie?.map(categ=>categ.id))
        ));
}