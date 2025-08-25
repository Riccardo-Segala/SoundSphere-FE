import {mapper} from "../mapper.initializer";
import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {CategoriaModel} from "../../../models/categoria.model";
import {ResponseCategoryNavigationDTO, ResponseParentCategoryDTO} from "../../../api-client";

export const categoriaProfile=(mapper:Mapper)=>{
    createMap(mapper, 'ResponseCategoryNavigationDTO', 'CategoriaModel',
        forMember(
            (destination:CategoriaModel)=>destination.children,
            mapFrom((source:ResponseCategoryNavigationDTO)=>{
                const childrenAsArray=source.children as unknown as ResponseParentCategoryDTO[];
                if(childrenAsArray && childrenAsArray.length>0){
                    //const childrenArray = Array.from(source.children);
                    const mappedChildren = mapper.mapArray<ResponseParentCategoryDTO, CategoriaModel>(
                        childrenAsArray,
                        'ResponseParentCategoryDTO', // La sorgente di ogni figlio
                        'CategoriaModel'         // La destinazione di ogni figlio
                    );
                    return new Set(mappedChildren);
                }
                return new Set<CategoriaModel>();
            })
        )
    );
    createMap(mapper,'ResponseParentCategoryDTO','CategoriaModel');
}