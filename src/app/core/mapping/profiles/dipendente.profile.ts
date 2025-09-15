import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {UtenteModel} from "../../../models/utente.model";
import {
    CreateEmployeeFromAdminDTO,
    CreateUserFromAdminDTO,
    UpdateEmployeeFromAdminDTO,
    UpdateUserFromAdminDTO
} from "../../../api-client";

export const dipendenteProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponseEmployeeDTO','UtenteModel');

    createMap(mapper,'UtenteModel','CreateEmployeeFromAdminDTO',
        forMember(
            (destination:CreateEmployeeFromAdminDTO)=>destination.utente,
            mapFrom((source:UtenteModel)=>mapper.map(source,'UtenteModel','CreateUserFromAdminDTO'))
        )
    );
    createMap(mapper,'UtenteModel','UpdateEmployeeFromAdminDTO',
        forMember(
            (destination:UpdateEmployeeFromAdminDTO)=>destination.ruoliIds,
            mapFrom((source:UtenteModel)=>source.ruoli?.map(ruolo=>ruolo.id))
        )
    );
}