import {mapper} from "../mapper.initializer";
import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {CategoriaModel} from "../../../models/categoria.model";
import {ResponseCategoryDTO, ResponseCategoryNavigationDTO, ResponseParentCategoryDTO} from "../../../api-client";

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

    createMap(mapper,'ResponseCategoryDTO','CategoriaModel',
        forMember(
            (destination:CategoriaModel)=>destination.parent,
            mapFrom((source:ResponseCategoryDTO)=>
                source.parent
                    ? mapper.map<ResponseParentCategoryDTO, CategoriaModel>(source.parent, 'ResponseParentCategoryDTO', 'CategoriaModel')
                    : undefined
            )
        ));
    createMap(mapper,'ResponseParentCategoryDTO','CategoriaModel');
}