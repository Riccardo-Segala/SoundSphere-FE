import {ResponseParentCategoryDTO} from "../api-client";

export interface CategoriaModel {
    id:string;
    name: string;
    slug: string;
    children: Set<CategoriaModel>;
    isLeaf: boolean;
}