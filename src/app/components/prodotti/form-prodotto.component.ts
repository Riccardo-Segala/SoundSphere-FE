import {Component, OnInit} from "@angular/core";
import {ProdottoModel} from "../../models/prodotto.model";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminProdottoControllerService, ProdottoControllerService, ResponseProductDTO} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
    selector: "app-form-prodotto",
    standalone: true,
    imports: [
        FormsModule,
        NgIf
    ],
    templateUrl: './form-prodotto.component.html',
    styleUrls:['form-prodotto.component.scss']
})
export class FormProdottoComponent implements OnInit {
    prodotto:ProdottoModel={};
    loggedUser:UtenteModel|null = null;
    modifica:boolean=false;
    id:string|null='';

    constructor(
        private session:SessionService,
        private router:Router,
        private route:ActivatedRoute,
        private prodService:ProdottoControllerService,
        private adminProdService:AdminProdottoControllerService
    ) {}

    ngOnInit() {
        this.loggedUser = this.session.getUser();
        //if(this.loggedUser && (this.loggedUser.ruoli?.includes("ADMIN")))
        if(this.loggedUser && this.loggedUser.ruoli?.some(ruolo=>ruolo.nome==="ADMIN")){
            this.id=this.route.snapshot.paramMap.get("id");
            if(this.id){
                this.modifica=true;
                this.prodService.getProductById(this.id)
                    .pipe(map(dto=>mapper.map<ResponseProductDTO,ProdottoModel>(dto,'ResponseProductDTO','ProdottoModel')))
                    .subscribe({
                        next:(res:ProdottoModel)=>{
                            this.prodotto=res;
                        },
                        error:(err)=>{
                            console.log("Errore ottenimento prodotto: "+err);
                        }
                    })
            }
            else{
                this.modifica=false;
            }
        }
    }
    salva(){
        if(this.modifica){
            if(this.id){
                this.adminProdService.updateProduct(this.id,mapper.map(this.prodotto,'ProdottoModel','UpdateProductDTO'))
                    .pipe(map(dto=>mapper.map<ResponseProductDTO,ProdottoModel>(dto,'ResponseProductDTO','ProdottoModel')))
                    .subscribe({
                        next:(res:ProdottoModel)=>{
                            this.prodotto=res;
                            this.router.navigate(['/prodotti']);
                        },
                        error:(err)=>{
                            console.log("Errore aggiornamento prodotto: "+err);
                        }
                    })
            }

        }else{
            this.adminProdService.createProduct(mapper.map(this.prodotto,'ProdottoModel','UpdateProductDTO'))
                .pipe(map(dto=>mapper.map<ResponseProductDTO,ProdottoModel>(dto,'ResponseProductDTO','ProdottoModel')))
                .subscribe({
                    next:(res:ProdottoModel)=>{
                        this.prodotto=res;
                        this.router.navigate(['/prodotti']);
                    },
                    error:(err)=>{
                        console.log("Errore inserimento prodotto: "+err);
                    }
                })
        }
    }
}