import {
    CreateUserDTO, CreateUserFromAdminDTO,
    ResponseBenefitDTO,
    ResponseProductDTO,
    ResponseUserDTO,
    UpdateUserFromAdminDTO
} from "../../../api-client";
import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {UtenteModel} from "../../../models/utente.model";
import {ProdottoModel} from "../../../models/prodotto.model";
import {VantaggioModel} from "../../../models/vantaggio.model";
import {RuoloModel} from "../../../models/ruolo.model";

export const utenteProfile = (mapper:Mapper) => {
    createMap(mapper,'ResponseUserDTO','UtenteModel',
        forMember(
            (destination:UtenteModel)=>destination.vantaggio,
            mapFrom((source:ResponseUserDTO)=>
                source.vantaggio
                    ? mapper.map<ResponseBenefitDTO,VantaggioModel>(source.vantaggio,'ResponseBenefitDTO','VantaggioModel')
                    : null
            )
        ),
        forMember(
            (destination:UtenteModel)=>destination.ruoli,
            mapFrom((source: ResponseUserDTO) =>
                source.ruoli
                    ? source.ruoli.map(nomeRuolo => ({id:"", nome: nomeRuolo } as RuoloModel))
                    : []
            )
        )
    );
    createMap(mapper,'UtenteModel','UpdateUserDTO');
    createMap(mapper,'UtenteModel','CreateUserDTO');
    createMap(mapper,'UtenteModel','UpdateUserFromAdminDTO',
        forMember(
            (destination:UpdateUserFromAdminDTO)=>destination.vantaggioId,
            mapFrom((source:UtenteModel)=>source.vantaggio?.id)
        ),
        forMember(
            (destination:CreateUserFromAdminDTO)=>destination.ruoliIds,
            mapFrom((source:UtenteModel)=>source.ruoli?.map(ruolo=>ruolo.id))
        )
    );
    createMap(mapper,'UtenteModel','CreateUserFromAdminDTO',
        forMember(
            (destination:CreateUserFromAdminDTO)=>destination.vantaggioId,
            mapFrom((source:UtenteModel)=>source.vantaggio?.id)
        ),
        forMember(
            (destination:CreateUserFromAdminDTO)=>destination.ruoliIds,
            mapFrom((source:UtenteModel)=>source.ruoli?.map(ruolo=>ruolo.id))
        )
    );
}