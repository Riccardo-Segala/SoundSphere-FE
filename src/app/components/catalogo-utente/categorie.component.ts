import {Component, OnInit} from "@angular/core";
import {
    CategoriaControllerService,
    ResponseCategoryDTO,
    ResponseCategoryNavigationDTO,
    ResponseParentCategoryDTO
} from "../../api-client";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {CategoriaModel} from "../../models/categoria.model";
import {map, Subscription} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {CategoryCardComponent} from "../../shared/components/category-card/category-card.component";
import {EventiComponent} from "../eventi/eventi.component";

@Component({
    selector: "app-categorie",
    standalone: true,
    templateUrl: "./categorie.component.html",
    imports: [
        RouterLink,
        NgForOf,
        CategoryCardComponent,
        EventiComponent
    ],
    styleUrl: "./categorie.component.scss"
})
export class CategorieComponent implements OnInit {
    categorieView:CategoriaModel[]=[];
    categoria:CategoriaModel|null=null;
    slug:string|null=null;
    private routeSub:Subscription=new Subscription();

    constructor(
        private httpClient:HttpClient,
        private router:Router,
        private categorieService:CategoriaControllerService,
        private route:ActivatedRoute) {
    }

    ngOnInit() {
        this.routeSub = this.route.paramMap.subscribe(params =>{
            const slug = params.get("slug");
            this.caricaCategoria(slug);
        });
    }

    ngOnDestroy(){
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }

    caricaCategoria(slug:string|null){
        if(slug){
            this.categorieService.getCategoryDetailsBySlug(slug)
                .pipe(map(dtos=>mapper.map<ResponseCategoryNavigationDTO,CategoriaModel>(
                    dtos,
                    'ResponseCategoryNavigationDTO',
                    'CategoriaModel'))
                )
                .subscribe({
                    next: (categoria:CategoriaModel) => {
                        if(categoria.isLeaf){
                            this.router.navigate(["catalogo-utente",categoria.slug]);
                        }
                        else{
                            this.categoria=categoria;
                            if(this.categoria.children) {
                                this.categorieView = Array.from(this.categoria.children);
                            }
                        }
                    },
                    error: (err) => {
                        console.log("Errore ottenimento categorie intermedie: "+err);
                    }
                });
        }
        else{
            this.categorieService.getTopLevelCategories()
                .pipe(map(dtos=>mapper.mapArray<ResponseCategoryDTO,CategoriaModel>(dtos,'ResponseParentCategoryDTO','CategoriaModel')))
                .subscribe({
                    next:(categorie)=>{
                        this.categorieView = categorie;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento categorie principali: "+err);
                    }
                });
        }
    }
}