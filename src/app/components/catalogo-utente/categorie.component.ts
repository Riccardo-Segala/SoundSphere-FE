import {Component, OnDestroy, OnInit} from "@angular/core";
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
import {UtenteModel} from "../../models/utente.model";
import {SessionService} from "../../services/session.service";

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
export class CategorieComponent implements OnInit,OnDestroy {
    categorieView:CategoriaModel[]=[];
    categoria:CategoriaModel|null=null;
    slug:string|null=null;
    private routeSub:Subscription=new Subscription();
    loggedUser:UtenteModel|null=null;

    constructor(
        private httpClient:HttpClient,
        private router:Router,
        private session:SessionService,
        private categorieService:CategoriaControllerService,
        private route:ActivatedRoute) {
    }

    ngOnInit() {
        /*
        * routeSub fondamentale per permettere di aggiornare la pagina. Infatti,
        * se non fosse un Subscription, chiamare la stesso componente non invocherebbe
        * la ngOnInit, rimanendo fermo
        * */
        this.routeSub = this.route.paramMap.subscribe(params =>{
            const slug = params.get("slug");
            this.caricaCategoria(slug);
        });

        this.loggedUser=this.session.getUser();
        if(this.loggedUser && this.loggedUser.ruoli){
            const nomiRuoli=this.loggedUser.ruoli.map(ruolo=>ruolo.nome);
            //controllo se l'utente è solo dipendente, dato che non può accedere a questa pagina
            if(!(nomiRuoli.includes("UTENTE")||nomiRuoli.includes("ORGANIZZATORE_EVENTI")||nomiRuoli.includes("ADMIN"))){
                this.router.navigate(['/stock']);
            }
        }
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
                                //children è un Set(), quindi bisogna convertirlo in Array
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