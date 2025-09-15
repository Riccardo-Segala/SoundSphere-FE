import {createMap, Mapper} from "@automapper/core";

export const permessoProfile = (mapper:Mapper)=>{
    createMap(mapper,'ResponsePermissionDTO','PermessoModel');
}