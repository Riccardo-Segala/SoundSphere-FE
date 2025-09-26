import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { SessionService } from './services/session.service';
import {HttpClient} from "@angular/common/http";
import {
    CategoriaControllerService, DipendenteControllerService,
    ProdottoControllerService, ResponseBranchDTO,
    ResponseParentCategoryDTO,
    ResponseUserDTO
} from "./api-client";
import {FormsModule} from "@angular/forms";
import {UtenteModel} from "./models/utente.model";
import {CategoriaModel} from "./models/categoria.model";
import {mapper} from "./core/mapping/mapper.initializer";
import {map} from "rxjs";
import {FilialeModel} from "./models/filiale.model";


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [CommonModule,RouterOutlet, RouterLink,FormsModule],
    templateUrl: 'app.component.html',
    styleUrl: 'app.component.scss'
})
export class AppComponent implements OnInit{
    loggedUser:UtenteModel|null=null;
    title='frontend';
    categorieMacro:CategoriaModel[]=[];
    filiale:FilialeModel={};

    constructor(
        private http:HttpClient,
        public router:Router,
        private session:SessionService,
        private prodottoService: ProdottoControllerService,
        private categoriaService:CategoriaControllerService,
        private dipendenteService:DipendenteControllerService) {
    }
    ngOnInit() {
        //this.loggedUser=this.session.getLoggedUser();
        //riceve il valore ogni volta che la variabile user$ viene aggiornata nel session service
        //tipo chiamata asincrona di API
        this.session.user$.subscribe(u=>this.loggedUser=u);

        if(this.loggedUser && this.loggedUser.ruoli?.some(ruolo=>ruolo.nome==="DIPENDENTE")){
            this.dipendenteService.getMyBranch()
                .pipe(map(dto=>mapper.map<ResponseBranchDTO,FilialeModel>(dto,'ResponseBranchDTO','FilialeModel')))
                .subscribe({
                    next:(res:FilialeModel)=>{
                        this.filiale=res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento filiale: ",JSON.stringify(err));
                    }
                });
        }


        this.categoriaService.getTopLevelCategories()
            .pipe(map(dtos=>mapper.mapArray<ResponseParentCategoryDTO,CategoriaModel>(
                dtos,
                'ResponseParentCategoryDTO',
                'CategoriaModel'
            )))
            .subscribe({
                next:(categorie:CategoriaModel[])=>{
                    this.categorieMacro=categorie;
                },
                error:(err)=>{
                    console.log("Errore ottenimento macro categorie: "+JSON.stringify(err));
                }
            });
    }
    logout() :void {
        this.session.clearLoggedUser();
        this.loggedUser=this.session.getUser();
        this.router.navigate(['/']);
    }
    carrello(path:string){
        this.router.navigate([path]);
    }
    adminPage(){
        this.router.navigate(['admin-page']);
    }
    isAdmin():boolean{
        if(this.loggedUser && this.loggedUser.ruoli){
            return this.loggedUser.ruoli.some(ruolo=>ruolo.nome==="ADMIN");
        }
        return false;

    }

    isEmployee():boolean{
        if(this.loggedUser && this.loggedUser.ruoli){
            return this.loggedUser.ruoli.some(ruolo=>ruolo.nome==="DIPENDENTE");
        }
        return false;
    }

    isOnlyEmployee():boolean{
        if(this.loggedUser && this.loggedUser.ruoli && this.loggedUser.ruoli.length===1){
            return this.loggedUser.ruoli.map(ruolo=>ruolo.nome).includes("DIPENDENTE");
        }
        return false;
    }

    calcolaProgresso(user:UtenteModel){
        if (user.punti !== undefined &&
            user.vantaggio &&
            user.vantaggio.punteggioMinimo !== undefined &&  // Controllo esplicito
            user.vantaggio.punteggioMassimo !== undefined) { // Controllo esplicito

            const puntiInVantaggio = user.punti - user.vantaggio.punteggioMinimo; // 98 - 0 = 98
            const range = user.vantaggio.punteggioMassimo - user.vantaggio.punteggioMinimo; // 100 - 0 = 100
            if (range <= 0) {
                return 1;
            }
            return (puntiInVantaggio / range) * 100; // (98 / 100) * 100 = 98
        }
        return 0;
    }

}
