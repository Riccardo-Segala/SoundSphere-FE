import {createMapper,type Mapper} from "@automapper/core";
import {pojos} from "@automapper/pojos";
import {setupMapperMetadata} from "./mapper.config";
import {prodottoProfile} from "./profiles/prodotto.profile";
import {carrelloProfile} from "./profiles/carrello.profile";
import {utenteProfile} from "./profiles/utente.profile";
import {indirizzoUtenteProfile} from "./profiles/indirizzo-utente.profile";
import {categoriaProfile} from "./profiles/categoria.profile";

function initializeMapper():Mapper{
    setupMapperMetadata();

    const mapper=createMapper({
        strategyInitializer:pojos()
    });

    prodottoProfile(mapper);
    carrelloProfile(mapper);
    indirizzoUtenteProfile(mapper);
    utenteProfile(mapper);
    categoriaProfile(mapper);

    return mapper;
}

export const mapper=initializeMapper();
