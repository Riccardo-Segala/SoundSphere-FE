import {createMap,forMember,mapFrom} from '@automapper/core';
import type {Mapper} from '@automapper/core';
import {CreateProductDTO,ResponseProductDTO,UpdateProductDTO} from "../../../api-client";
import {ProdottoModel} from "../../../models/prodotto.model";

export const prodottoProfile = (mapper:Mapper)=>{
    createMap(mapper,'ResponseProductDTO','ProdottoModel');
    createMap(mapper,'ProdottoModel','UpdateProductDTO');
    createMap(mapper,'ProdottoModel','CreateProductDTO');
}