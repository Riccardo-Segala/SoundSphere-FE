import {PermessoModel} from "./permesso.model";

export interface RuoloModel{
    id:string;
    nome:string;
    permessi:PermessoModel[];
}