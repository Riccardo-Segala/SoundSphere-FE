import {createMap, Mapper} from "@automapper/core";

export const indirizzoUtenteProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponseUserAddressDTO','IndirizzoUtenteModel');
    createMap(mapper,'IndirizzoUtenteModel','CreateUserAddressDTO');
    createMap(mapper,'IndirizzoUtenteModel','UpdateUserAddressDTO');
}