import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {RuoloModel} from "../../../models/ruolo.model";
import {ResponseRoleDTO, UpdateRoleDTO} from "../../../api-client";

export const ruoloProfile = (mapper:Mapper)=>{
    createMap(mapper,'ResponseRoleDTO','RuoloModel',
        forMember(
            (destination:RuoloModel)=>destination.permessi,
            mapFrom((source:ResponseRoleDTO)=> {
                if(source.permessi){
                    return mapper.map(source.permessi,'ResponsePermissionDTO','PermessoModel');
                }
                else{
                    return [];
                }
            }
        )
    ));

    createMap(mapper,'RuoloModel','UpdateRoleDTO',
        forMember(
            (destination:UpdateRoleDTO)=>destination.permessiIds,
            mapFrom((source:RuoloModel)=>source.permessi.map(ruolo=>ruolo.id))
        )
    );
    createMap(mapper,'RuoloModel','CreateRoleDTO',
        forMember(
            (destination:UpdateRoleDTO)=>destination.permessiIds,
            mapFrom((source:RuoloModel)=>source.permessi.map(ruolo=>ruolo.id))
        )
    );
}