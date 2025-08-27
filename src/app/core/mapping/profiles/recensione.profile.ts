import {createMap, Mapper} from "@automapper/core";

export const recensioneProfile = (mapper:Mapper)=>{
    createMap(mapper,'ResponseReviewDTO','RecensioneModel');
    createMap(mapper,'RecensioneModel','CreateReviewDTO');
    createMap(mapper,'RecensioneModel','UpdateReviewDTO');
}