import {Component, OnInit} from "@angular/core";
import {UtenteModel} from "../../models/utente.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {AdminUtenteControllerService, ResponseUserDTO} from "../../api-client";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {NgForOf} from "@angular/common";

@Component({
    selector: "app-lista-utenti",
    standalone: true,
    imports: [
        NgForOf
    ],
    templateUrl:'lista-utenti.component.html',
    styleUrls:['lista-utenti.component.scss']
})
export class ListaUtentiComponent implements OnInit {
    utenti:UtenteModel[]=[];
    utente:UtenteModel|null=null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private session: SessionService,
        private adminUtenteService:AdminUtenteControllerService
    ) {
    }

    ngOnInit() {
        this.utente=this.session.getUser();
        if(this.utente){
            this.caricaUtenti();
        }
        else{
            this.router.navigate(['/']);
        }
    }
    caricaUtenti(){
        this.adminUtenteService.getAllUsers()
            .pipe(map(dtos=>mapper.mapArray<ResponseUserDTO,UtenteModel>(dtos,'ResponseUserDTO','UtenteModel')))
            .subscribe({
                next: (res:UtenteModel[])=> {
                    this.utenti=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento utenti: "+err);
                }
            });
    }
    naviga(id:string|undefined){
        if(id){
            this.router.navigate(['utenti/modifica',id]);
        }else{
            this.router.navigate(['utenti/crea']);
        }
    }

    elimina(id:string|undefined){
        if(id){
            this.adminUtenteService.deleteUser(id).subscribe({
                next: ()=>{
                    this.caricaUtenti();
                },
                error:(err)=>{
                    console.log("Errore eliminazione utente: "+JSON.stringify(err));
                }
            })
        }
    }
}