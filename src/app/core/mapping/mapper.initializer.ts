import {createMapper,type Mapper} from "@automapper/core";
import {pojos} from "@automapper/pojos";
import {setupMapperMetadata} from "./mapper.config";
import {prodottoProfile} from "./profiles/prodotto.profile";
import {carrelloProfile} from "./profiles/carrello.profile";
import {utenteProfile} from "./profiles/utente.profile";
import {indirizzoUtenteProfile} from "./profiles/indirizzo-utente.profile";
import {categoriaProfile} from "./profiles/categoria.profile";
import {recensioneProfile} from "./profiles/recensione.profile";
import {metodoPagamentoProfile} from "./profiles/metodo-pagamento.profile";
import {vantaggioProfile} from "./profiles/vantaggio.profile";
import {dipendenteProfile} from "./profiles/dipendente.profile";
import {filialeProfile} from "./profiles/filiale.profile";
import {ruoloProfile} from "./profiles/ruolo.profile";
import {permessoProfile} from "./profiles/permesso.profile";
import {datiStaticiProfile} from "./profiles/dati-statici.profile";
import {ordineProfile} from "./profiles/ordine.profile";
import {noleggioProfile} from "./profiles/noleggio.profile";

function initializeMapper():Mapper{
    setupMapperMetadata();

    const mapper=createMapper({
        strategyInitializer:pojos()
    });

    prodottoProfile(mapper);
    carrelloProfile(mapper);
    indirizzoUtenteProfile(mapper);
    vantaggioProfile(mapper);
    utenteProfile(mapper);
    categoriaProfile(mapper);
    recensioneProfile(mapper);
    metodoPagamentoProfile(mapper);
    dipendenteProfile(mapper);
    filialeProfile(mapper);
    ruoloProfile(mapper);
    permessoProfile(mapper);
    datiStaticiProfile(mapper);
    ordineProfile(mapper);
    noleggioProfile(mapper);

    return mapper;
}

export const mapper=initializeMapper();
