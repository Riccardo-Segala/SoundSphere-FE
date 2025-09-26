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
  selector: 'app-root', // il tag
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
        //riceve il valore ogni volta che la variabile user$ viene aggiornata nel session service
        //tipo chiamata asincrona di API
        this.session.user$.subscribe(u=>this.loggedUser=u);
        //cerca la filiale solamente se l'utente è un dipendente
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

        /*carica l'elenco delle macrocategorie da mostrare nella navbar
          .pipe() permette di creare un canale intermedio tra la risposta
           della chiamata http e cosa fa l'applicazione con quel dato, noi lo abbiamo usato
           per mappare da DTO a model nelle varie chiamate get ai service*/
        this.categoriaService.getTopLevelCategories()
            .pipe(map(dtos=>mapper.mapArray<ResponseParentCategoryDTO,CategoriaModel>(
                dtos, //l'oggetto da mappare
                'ResponseParentCategoryDTO', //il metadata source
                'CategoriaModel' //il metadata destination
            )))
            // .subscribe permette di svolgere un'operazione quando termina la chiamata asincrona
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
        this.session.clearLoggedUser(); //cancella utente dalla sessione
        this.loggedUser=this.session.getUser(); //per assicurarsi che sia stato cancellato
        this.router.navigate(['/']); //manda alla home
    }
    carrello(path:string){
        this.router.navigate([path]);
    }
    isAdmin():boolean{
        //controlla se tra i ruoli ce n'è almeno uno con nome "ADMIN"
        if(this.loggedUser && this.loggedUser.ruoli){
            return this.loggedUser.ruoli.some(ruolo=>ruolo.nome==="ADMIN");
        }
        return false;

    }

    isEmployee():boolean{
        //controlla se tra i ruoli ce n'è almeno uno con nome "DIPENDENTE"
        if(this.loggedUser && this.loggedUser.ruoli){
            return this.loggedUser.ruoli.some(ruolo=>ruolo.nome==="DIPENDENTE");
        }
        return false;
    }

    isOnlyEmployee():boolean{
        //controlla se tra i ruoli dell'utente è presente solamente il ruolo "DIPENDENTE"
        if(this.loggedUser && this.loggedUser.ruoli && this.loggedUser.ruoli.length===1){
            return this.loggedUser.ruoli.map(ruolo=>ruolo.nome).includes("DIPENDENTE");
        }
        return false;
    }

    calcolaProgresso(user:UtenteModel){
        // per ritornare il valore dei punti nel range in % e controllare esistenza dei campi
        if (user.punti !== undefined &&
            user.vantaggio &&
            user.vantaggio.punteggioMinimo !== undefined &&  // Controllo esplicito
            user.vantaggio.punteggioMassimo !== undefined) { // Controllo esplicito

            // nella progressbar si parte sempre da 0 in un livello,
            // quindi il livello 2 che parte da 101 punti avrà barra vuota se si hanno 101 punti
            const puntiInVantaggio = user.punti - user.vantaggio.punteggioMinimo;
            const range = user.vantaggio.punteggioMassimo - user.vantaggio.punteggioMinimo;
            if (range <= 0) {
                return 1;
            }
            return (puntiInVantaggio / range) * 100; // (98 / 100) * 100 = 98
        }
        return 0;
    }

}
