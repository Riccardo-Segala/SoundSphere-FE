import {Component, OnInit} from "@angular/core";
import {UtenteModel} from "../../models/utente.model";
import {FilialeModel} from "../../models/filiale.model";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminFilialeControllerService, ResponseBranchDTO} from "../../api-client";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {FormsModule} from "@angular/forms";

@Component({
    selector:'app-form-filiale',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl:'form-filiale.component.html',
    styleUrls:['form-filiale.component.scss']
})
export class FormFilialeComponent implements OnInit{
    loggedUser:UtenteModel|null=null;
    filiale:FilialeModel={};
    modifica:boolean=false;
    id:string|null='';

    constructor(
        private session:SessionService,
        private router:Router,
        private route:ActivatedRoute,
        private adminFilialeService:AdminFilialeControllerService
    ) {
    }

    ngOnInit() {
        this.loggedUser = this.session.getUser();
        if(this.loggedUser && this.loggedUser.ruoli?.some(ruolo=>ruolo.nome=="ADMIN")){
            this.id=this.route.snapshot.paramMap.get('id');
            if(this.id){
                this.modifica=true;
                this.adminFilialeService.getBranchById(this.id)
                    .pipe(map(dto=>mapper.map<ResponseBranchDTO,FilialeModel>(dto,'ResponseBranchDTO','FilialeModel')))
                    .subscribe({
                        next:(res:FilialeModel)=>{
                            this.filiale=res;
                        },
                        error:(err)=>{
                            console.log("Errore ottenimento filiale: "+err);
                        }
                    });
            }
            else{
                this.modifica=false;
            }
        }
        else{
            this.router.navigate(["/"]);
        }
    }
    salva(){
        if(this.modifica){
            if(this.id){
                this.adminFilialeService.updateBranch(this.id,mapper.map(this.filiale,'FilialeModel','UpdateBranchDTO'))
                    .pipe(map(dto=>mapper.map<ResponseBranchDTO,FilialeModel>(dto,'ResponseBranchDTO','FilialeModel')))
                    .subscribe({
                        next:(res:FilialeModel)=>{
                            this.filiale=res;
                            this.router.navigate(['/filiali']);
                        },
                        error:(err)=>{
                            console.log("Errore aggiornamento filiale: "+err);
                        }
                    })
            }
        }
        else{
            this.adminFilialeService.createBranch(mapper.map(this.filiale,'FilialeModel','CreateBranchDTO'))
                .pipe(map(dto=>mapper.map<ResponseBranchDTO,FilialeModel>(dto,'ResponseBranchDTO','FilialeModel')))
                .subscribe({
                    next:(res:FilialeModel)=>{
                        this.filiale=res;
                        this.router.navigate(['/filiali']);
                    },
                    error:(err)=>{
                        console.log("Errore inserimento filiale: "+err);
                    }
                })
        }
    }
    annulla(){
        this.router.navigate(['/filiali']);
    }
}