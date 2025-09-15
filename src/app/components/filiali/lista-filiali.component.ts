import {Component, OnInit} from "@angular/core";
import {FilialeModel} from "../../models/filiale.model";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {AdminFilialeControllerService, ResponseBranchDTO} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {NgForOf} from "@angular/common";

@Component({
    selector:'app-lista-filiali',
    standalone:true,
    imports: [
        NgForOf
    ],
    templateUrl:"lista-filiali.component.html",
    styleUrls:["lista-filiali.component.scss"]
})
export class ListaFilialiComponent implements OnInit {
    filiali:FilialeModel[]=[];
    loggedUser:UtenteModel|null=null;
    constructor(
        private router:Router,
        private session:SessionService,
        private adminFilialeService:AdminFilialeControllerService
    ){
    }

    ngOnInit(){
        this.loggedUser=this.session.getUser();
        if(this.loggedUser && this.loggedUser.ruoli?.some(ruolo=>ruolo.nome==="ADMIN")){
           this.caricaFiliali();
        }
        else{
            this.router.navigate(["/"]);
        }
    }

    caricaFiliali(){
        this.adminFilialeService.getAllBranches()
            .pipe(map(dtos=>mapper.mapArray<ResponseBranchDTO,FilialeModel>(dtos,'ResponseBranchDTO','FilialeModel')))
            .subscribe({
                next:(res:FilialeModel[]) => {
                    this.filiali=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento filiali: "+err);
                }
            })
    }
    naviga(id:string|undefined){
        if(id){
            this.router.navigate(["filiali/modifica",id]);
        }
        else{
            this.router.navigate(['/filiali/crea']);
        }
    }
    elimina(id:string|undefined){
        if(id){
            this.adminFilialeService.deleteBranch(id).subscribe({
                next:(res) => {
                    console.log("Cancellazione avvenuta con successo");
                    this.caricaFiliali();
                },
                error:(err)=>{
                    console.log("Errore eliminazione filiale: "+err);
                }
            })
        }
    }
}