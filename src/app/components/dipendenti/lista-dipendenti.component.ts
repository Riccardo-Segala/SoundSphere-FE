import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {UtenteModel} from "../../models/utente.model";
import {AdminDipendenteControllerService, ResponseEmployeeDTO} from "../../api-client";
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
        private adminDipService:AdminDipendenteControllerService
    ) {
    }

    ngOnInit() {
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

    vaiModifica(id:string|undefined){
        if(id)
           this.router.navigate(['/modifica-dipendente',id]);
    }
}