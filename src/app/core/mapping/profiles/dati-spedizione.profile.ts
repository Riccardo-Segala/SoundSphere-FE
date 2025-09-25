import {createMap, Mapper} from "@automapper/core";

export const datiSpedizioneProfile =(mapper:Mapper)=>{
    createMap(mapper,"DeliveryLimitDataDTO","DatiSpedizioneModel");
    createMap(mapper,"DatiSpedizioneModel","DeliveryLimitDataDTO");
}