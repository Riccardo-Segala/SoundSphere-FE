import {createMapper,type Mapper} from "@automapper/core";
import {pojos} from "@automapper/pojos";
import {mapper, setupMapperMetadata} from "./mapper.config";
import {prodottoProfile} from "./profiles/prodotto.profile";
import {carrelloProfile} from "./profiles/carrello.profile";

function initializeMapper():Mapper{
    setupMapperMetadata();

    const mapper=createMapper({
        strategyInitializer:pojos()
    });

    prodottoProfile(mapper);
    carrelloProfile(mapper);

    return mapper;
}

export const mapper=initializeMapper();
