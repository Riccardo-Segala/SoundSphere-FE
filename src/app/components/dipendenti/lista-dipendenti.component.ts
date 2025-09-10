import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {UtenteModel} from "../../models/utente.model";
import {
    AdminDipendenteControllerService,
    AdminUtenteControllerService,
    ResponseEmployeeDTO,
    UtenteControllerService
} from "../../api-client";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {NgForOf} from "@angular/common";

@Component({
    selector: "app-lista-dipendenti",
    standalone:true,
    imports: [
        NgForOf
    ],
    templateUrl: "lista-dipendenti.component.html",
    styleUrls:["lista-dipendenti.component.scss"]
})
export class ListaDipendentiComponent implements OnInit {
    dipendenti:UtenteModel[]=[];
    constructor(
        private router: Router,
        private session:SessionService,
        private adminDipService:AdminDipendenteControllerService,
        private adminUtenteService:AdminUtenteControllerService
    ) {
    }

    ngOnInit() {
        this.caricaDipendenti();
    }

    caricaDipendenti(){
        this.adminDipService.getAllEmployees()
            .pipe(map(dtos=>mapper.mapArray<ResponseEmployeeDTO,UtenteModel>(dtos,'ResponseEmployeeDTO','UtenteModel')))
            .subscribe({
                next:(res:UtenteModel[])=>{
                    this.dipendenti=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento lista dipendenti: "+err);
                }
            });
    }

    naviga(id:string|undefined){
        if(id)
           this.router.navigate(['/dipendenti/modifica',id]);
        else
            this.router.navigate(['/dipendenti/crea']);
    }
    elimina(id:string|undefined){
        if(id){
            this.adminUtenteService.deleteUser(id).subscribe({
                next:(res)=>{
                    console.log('Eliminazione completata');
                    this.caricaDipendenti();
                },
                error:(err)=>{
                    console.log("Errore cancellazione dipendente");
                }
            })
        }
    }
}