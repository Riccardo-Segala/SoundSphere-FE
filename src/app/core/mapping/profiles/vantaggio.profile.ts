import {createMap, Mapper} from "@automapper/core";

export const vantaggioProfile =(mapper:Mapper)=>{
    createMap(mapper,'ResponseBenefitDTO','VantaggioModel');
    createMap(mapper,'VantaggioModel','CreateBenefitDTO');
    createMap(mapper,'VantaggioModel','UpdateBenefitDTO');
}