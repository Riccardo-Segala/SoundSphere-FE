import {createMap, Mapper} from "@automapper/core";

export const datiStaticiProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponseStaticDataDTO','DatiStaticiModel');
    createMap(mapper,'DatiStaticiModel','CreateOrUpdateStaticDataDTO');
}