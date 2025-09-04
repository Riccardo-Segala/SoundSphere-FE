import {Component, OnInit} from "@angular/core";
import {ProdottoModel} from "../../models/prodotto.model";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {AdminProdottoControllerService, ResponseProductDTO} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {NgForOf} from "@angular/common";

@Component({
    selector:'app-lista-prodotti',
    standalone: true,
    imports: [
        NgForOf
    ],
    templateUrl:'lista-prodotti.component.html',
    styleUrls:['lista-prodotti.component.scss'],
})
export class ListaProdottiComponent implements OnInit {
    prodotti:ProdottoModel[]=[];
    loggedUser:UtenteModel|null=null;

    constructor(
        private router:Router,
        private session:SessionService,
        private adminProdService:AdminProdottoControllerService
    ) {
    }

    ngOnInit() {
        this.loggedUser=this.session.getUser();
        if(this.loggedUser && (this.loggedUser.ruoli?.includes("ADMIN") || this.loggedUser.ruoli?.includes("DIPENDENTE"))){
            this.caricaProdotti();
        }
        else{
            this.router.navigate(['/']);
        }
    }

    caricaProdotti(){
        this.adminProdService.getAllProducts()
        .pipe(map(dtos=>mapper.mapArray<ResponseProductDTO,ProdottoModel>(dtos,'ResponseProductDTO','ProdottoModel')))
        .subscribe({
            next:(res:ProdottoModel[])=>{
                this.prodotti=res;
            },
            error:(err)=>{
                console.log("Errore ottenimento prodotti: "+err);
            }
        });
    }


    naviga(id: string|undefined){
        if(id) {
            this.router.navigate(["prodotti/modifica",id]);
        }else{
            this.router.navigate(["prodotti/crea"]);
        }
    }
    elimina(id:string|undefined){
        if(id){
            this.adminProdService.deleteProduct(id).subscribe({
                next:(res)=>{
                    console.log("Eliminazione avvenuta con successo");
                    this.caricaProdotti();
                },
                error:(err)=>{
                    console.log(err);
                }
            })
        }

    }
}