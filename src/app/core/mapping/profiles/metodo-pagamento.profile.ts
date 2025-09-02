import {createMap, Mapper} from "@automapper/core";

export const metodoPagamentoProfile=(mapper:Mapper)=>{
    createMap(mapper,'ResponsePaymentMethodDTO','MetodoPagamentoModel');
    createMap(mapper,'MetodoPagamentoModel','UpdatePaymentMethodDTO');
    createMap(mapper,'MetodoPagamentoModel','CreatePaymentMethodDTO');
}