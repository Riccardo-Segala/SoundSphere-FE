import {Component, OnInit} from "@angular/core";
import {ProdottoModel} from "../../models/prodotto.model";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
    AdminProdottoControllerService,
    CategoriaControllerService, ImageUploadControllerService,
    ProdottoControllerService, ResponseCategoryDTO, ResponseCategoryNavigationDTO, ResponseParentCategoryDTO,
    ResponseProductDTO
} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {map, Observable} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CategoriaModel} from "../../models/categoria.model";
import {CategoriaComponent} from "./categorie/categoria.component";
// import {UploadImageRequest} from "../../api-client/model/uploadImageRequest";


@Component({
    selector: "app-form-prodotto",
    standalone: true,
    imports: [
        FormsModule,
        NgIf,
        CategoriaComponent,
        NgForOf
    ],
    templateUrl: './form-prodotto.component.html',
    styleUrls:['form-prodotto.component.scss']
})
export class FormProdottoComponent implements OnInit {
    prodotto:ProdottoModel={};
    loggedUser:UtenteModel|null = null;
    modifica:boolean=false;
    id:string|null='';
    categorie:CategoriaModel[]=[];
    macroCategorie:CategoriaModel[]=[];
    previewUrl:string|ArrayBuffer|null='/images/placeholder-prodotto'
    selectedCategoria:string|undefined=undefined;

    constructor(
        private session:SessionService,
        private router:Router,
        private route:ActivatedRoute,
        private prodService:ProdottoControllerService,
        private adminProdService:AdminProdottoControllerService,
        private categoriaService:CategoriaControllerService,
        private imageUploadService:ImageUploadControllerService
    ) {}

    ngOnInit() {
        this.loggedUser = this.session.getUser();
        if(this.loggedUser && this.loggedUser.ruoli?.some(ruolo=>ruolo.nome==="ADMIN")){
            this.id=this.route.snapshot.paramMap.get("id");
            if(this.id){
                this.modifica=true;
                this.prodService.getProductById(this.id)
                    .pipe(map(dto=>mapper.map<ResponseProductDTO,ProdottoModel>(dto,'ResponseProductDTO','ProdottoModel')))
                    .subscribe({
                        next:(res:ProdottoModel)=>{
                            this.prodotto=res;
                            if(this.prodotto.prezzo) {
                                this.prodotto.prezzo = Number.parseFloat(this.prodotto.prezzo.toFixed(2));
                            }
                            if(this.prodotto.costoGiornaliero){
                                this.prodotto.costoGiornaliero=Number.parseFloat(this.prodotto.costoGiornaliero.toFixed(2));
                            }

                            if(!this.prodotto.categorie){
                                this.prodotto.categorie=[];
                            }
                            if(this.prodotto.pathImmagine){
                                this.previewUrl=this.prodotto.pathImmagine;
                            }
                            this.caricaCategorie();
                        },
                        error:(err)=>{
                            console.log("Errore ottenimento prodotto: "+err);
                        }
                    })
            }
            else{
                this.modifica=false;
                this.prodotto.categorie=[];
                this.caricaCategorie();
            }
        }


    }

    caricaCategorie(){
        this.categoriaService.getTopLevelCategories()
            .pipe(map(dtos=>mapper.mapArray<ResponseParentCategoryDTO,CategoriaModel>(dtos,'ResponseParentCategoryDTO','CategoriaModel')))
            .subscribe({
                next:(res:CategoriaModel[])=>{
                    for(let c of res){
                        this.categoriaService.getCategoryDetailsById(c.id)
                            .pipe(map(dto=>mapper.map<ResponseCategoryNavigationDTO,CategoriaModel>(dto,'ResponseCategoryNavigationDTO','CategoriaModel')))
                            .subscribe({
                                next:(res:CategoriaModel)=>{
                                    this.macroCategorie.push(res);
                                }
                            });
                        this.caricaCategorieFoglie(c);
                    }
                },
                error:(err)=>{
                    console.log("Errore ottenimento categorie: ",JSON.stringify(err));
                }
            })
    }
    caricaCategorieFoglie(c:CategoriaModel){
        this.categoriaService.getCategoryDetailsById(c.id)
            .pipe(map(dto=>mapper.map<ResponseCategoryNavigationDTO,CategoriaModel>(dto,'ResponseCategoryNavigationDTO','CategoriaModel')))
            .subscribe({
                next:(res:CategoriaModel)=>{
                    if(res.isLeaf){
                        this.categorie.push(res);
                    }
                    else{
                        for(let sottocategoria of res.children){
                            this.caricaCategorieFoglie(sottocategoria);
                        }
                    }
                }
            })
    }
    salva(){
        let api$:Observable<ProdottoModel>;
        //crea un prodotto con gli stessi attributi degli input, ma con anche il flag rentable
        const prodotto={...this.prodotto,rentable:true};
        if(this.modifica){
            if(this.id){
                api$=this.adminProdService.updateProduct(this.id,mapper.map(prodotto,'ProdottoModel','UpdateProductDTO'))
                    .pipe(map(dto=>mapper.map<ResponseProductDTO,ProdottoModel>(dto,'ResponseProductDTO','ProdottoModel')));
            }
            else{
                return;
            }
        }
        else{
            api$=this.adminProdService.createProduct(mapper.map(this.prodotto,'ProdottoModel','UpdateProductDTO'))
                .pipe(map(dto=>mapper.map<ResponseProductDTO,ProdottoModel>(dto,'ResponseProductDTO','ProdottoModel')));
        }

        api$.subscribe({
            next:(res:ProdottoModel)=>{
                this.prodotto=res;
                this.router.navigate(['prodotti']);
            },
            error:(err)=>{
                console.log("Errore salvataggio prodotto: ",JSON.stringify(err));
            }
        })
    }
    annulla(){
        this.router.navigate(["/prodotti"]);
    }

    fileSelezionato(event:any){
        const img:File=event.target.files[0];
        if(!img){
            return;
        }
        const reader=new FileReader();
        reader.onload=()=>this.previewUrl=reader.result;
        reader.readAsDataURL(img);

        this.imageUploadService.uploadImage(img).subscribe({
            next:(res:any)=>{
                this.prodotto.pathImmagine=res.path;
                this.previewUrl=res.path;
            },
            error:(err)=>{
                console.log("Errore caricamento immagine: ",JSON.stringify(err));
            }
        });
    }

    rimuoviCategoria(id:string){
        if(id && this.prodotto.categorie){
            this.prodotto.categorie=this.prodotto.categorie.filter(categ=>categ.id!==id);
        }
    }

    selezionaCategoria(id:string){
        if(id){
            if(this.selectedCategoria!==id){
                this.selectedCategoria=id;
            }else{
                return;
            }
        }
    }

    aggiungi(id:string){
        if(id && this.prodotto.categorie){
            const category=this.categorie.find(categ=>categ.id===id);
            if(!this.prodotto.categorie?.find(categ=>categ.id===id) && category){
                this.prodotto.categorie?.push(category);
            }
        }
    }
}