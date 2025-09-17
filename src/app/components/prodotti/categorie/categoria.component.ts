import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CategoriaModel} from "../../../models/categoria.model";
import {NgForOf, NgIf} from "@angular/common";
import {CategoriaControllerService, ResponseCategoryNavigationDTO} from "../../../api-client";
import {mapper} from "../../../core/mapping/mapper.initializer";
import {map} from "rxjs";

@Component({
    selector:'app-categorie-prodotto',
    standalone:true,
    imports: [
        NgForOf,
        NgIf
    ],
    templateUrl:'categoria.component.html',
    styleUrls:['categoria.component.scss']
})
export class CategoriaComponent implements OnInit{
    @Input() categoriaInput!:CategoriaModel;
    @Input() categorieProdotto:CategoriaModel[]|undefined=undefined;
    @Output() categoriaSelezionata=new EventEmitter<string>();
    selectedCategoria:string|undefined=undefined;
    categorieFiglie:CategoriaModel[]=[];

    constructor(
        private categorieService:CategoriaControllerService
    ) {
    }

    ngOnInit() {
        for(let c of this.categoriaInput.children){
            this.categorieService.getCategoryDetailsById(c.id)
                .pipe(map(dto=>mapper.map<ResponseCategoryNavigationDTO,CategoriaModel>(dto,'ResponseCategoryNavigationDTO','CategoriaModel')))
                .subscribe({
                    next:(res:CategoriaModel)=>{
                        this.categorieFiglie.push(res);
                    },
                    error:(err)=>{
                        console.log("Errore categoria: ",JSON.stringify(err));
                    }
                })
        }
    }

    seleziona(id:string){
        if(id){
            if(this.selectedCategoria!==id){
                this.selectedCategoria=id;
            }else{
                this.selectedCategoria=undefined;
            }
        }
    }

    aggiungi(id:string){
        this.categoriaSelezionata.emit(id);
    }

    isSelected(id:string){
        if(this.categorieProdotto){
            return this.categorieProdotto.find(categ=>categ.id===id);
        }
        return false;
    }


}