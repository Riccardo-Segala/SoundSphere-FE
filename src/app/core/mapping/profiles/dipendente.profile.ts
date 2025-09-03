import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {UtenteModel} from "../../../models/utente.model";
import {CreateEmployeeFromAdminDTO, CreateUserFromAdminDTO} from "../../../api-client";

export const dipendenteProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponseEmployeeDTO','UtenteModel');

    createMap(mapper,'UtenteModel','CreateUserFromAdminDTO',
        forMember(
            (destination:CreateUserFromAdminDTO)=>destination.ruoliIds,
            mapFrom((source: UtenteModel)=>{
                const ids=source.ruoliIds;
                if(Array.isArray(ids)){
                    return new Set(ids);
                }
                return new Set();
            })
        ),
        forMember(
            (destination:CreateUserFromAdminDTO)=>destination.vantaggioId,
            mapFrom((source:UtenteModel)=>source.vantaggio?.id)
        )
    );
    createMap(mapper,'UtenteModel','CreateEmployeeFromAdminDTO',
        forMember(
            (destination:CreateEmployeeFromAdminDTO)=>destination.utente,
            mapFrom((source:UtenteModel)=>mapper.map(source,'UtenteModel','CreateUserFromAdminDTO'))
        )
    );
}