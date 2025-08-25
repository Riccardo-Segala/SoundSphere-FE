import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { SessionService } from './services/session.service';
import {HttpClient} from "@angular/common/http";
import {
    CategoriaControllerService,
    ProdottoControllerService,
    ResponseParentCategoryDTO,
    ResponseUserDTO
} from "./api-client";
import {FormsModule} from "@angular/forms";
import {UtenteModel} from "./models/utente.model";
import {CategoriaModel} from "./models/categoria.model";
import {mapper} from "./core/mapping/mapper.initializer";
import {map} from "rxjs";


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [CommonModule,RouterOutlet, RouterLink,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    loggedUser:UtenteModel|null=null;
    title='frontend';
    categorieMacro:CategoriaModel[]=[];

    constructor(
        private http:HttpClient,
        public router:Router,
        private session:SessionService,
        private prodottoService: ProdottoControllerService,
        private categoriaService:CategoriaControllerService) {
    }
    ngOnInit() {
        //this.loggedUser=this.session.getLoggedUser();
        //riceve il valore ogni volta che la variabile user$ viene aggiornata nel session service
        //tipo chiamata asincrona di API
        this.session.user$.subscribe(u=>this.loggedUser=u);

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
                    console.log("Errore ottenimento macro categorie: "+err);
                }
            });
    }
    logout() :void {
        this.session.clearLoggedUser();
        this.loggedUser=this.session.getUser();
        this.router.navigate(['/']);
    }
    carrello(){
        this.router.navigate(["carrello"]);
    }
}
