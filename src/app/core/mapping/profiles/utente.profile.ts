import {CreateUserDTO, ResponseBenefitDTO, ResponseProductDTO, ResponseUserDTO} from "../../../api-client";
import {createMap, forMember, mapFrom, Mapper} from "@automapper/core";
import {UtenteModel} from "../../../models/utente.model";
import {ProdottoModel} from "../../../models/prodotto.model";
import {VantaggioModel} from "../../../models/vantaggio.model";

export const utenteProfile = (mapper:Mapper) => {
    createMap(mapper,'ResponseUserDTO','UtenteModel',
        forMember(
            (destination:UtenteModel)=>destination.vantaggio,
            mapFrom((source:ResponseUserDTO)=>
                source.vantaggio
                    ? mapper.map<ResponseBenefitDTO,VantaggioModel>(source.vantaggio,'ResponseBenefitDTO','VantaggioModel')
                    : null
            )
        )
    );
    createMap(mapper,'UtenteModel','UpdateUserDTO');
    createMap(mapper,'UtenteModel','CreateUserDTO');
}