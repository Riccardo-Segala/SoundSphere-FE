import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {FilialeModel} from "../../../models/filiale.model";
import {ResponseBranchDTO} from "../../../api-client";

export const filialeProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponseBranchDTO','FilialeModel',
        forMember(
            (destination:FilialeModel)=>destination.via,
            mapFrom((source:ResponseBranchDTO)=>source.indirizzo?.via)
        ),
        forMember(
            (destination:FilialeModel)=>destination.cap,
            mapFrom((source:ResponseBranchDTO)=>source.indirizzo?.cap)
        ),
        forMember(
            (destination:FilialeModel)=>destination.nazione,
            mapFrom((source:ResponseBranchDTO)=>source.indirizzo?.nazione)
        ),
        forMember(
            (destination:FilialeModel)=>destination.citta,
            mapFrom((source:ResponseBranchDTO)=>source.indirizzo?.citta)
        ),
        forMember(
            (destination:FilialeModel)=>destination.provincia,
            mapFrom((source:ResponseBranchDTO)=>source.indirizzo?.provincia)
        )
    );
    createMap(mapper,'FilialeModel','UpdateBranchDTO');
    createMap(mapper,'FilialeModel','CreateBranchDTO');
}