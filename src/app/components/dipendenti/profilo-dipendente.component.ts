import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {
    AdminDipendenteControllerService, AdminFilialeControllerService,
    AdminUtenteControllerService,
    DipendenteControllerService, ResponseBenefitDTO, ResponseBranchDTO,
    ResponseEmployeeDTO, VantaggioControllerService,
    CreateEmployeeFromAdminDTO
} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {FormsModule} from "@angular/forms";
import {VantaggioModel} from "../../models/vantaggio.model";
import {FilialeModel} from "../../models/filiale.model";
import {NgForOf} from "@angular/common";

@Component({
    selector:'app-profilo-dipendente',
    standalone: true,
    imports: [
        FormsModule,
        NgForOf
    ],
    templateUrl:'profilo-dipendente.component.html',
    styleUrls:['profilo-dipendente.component.scss']
})
export class ProfiloDipendenteComponent implements OnInit {
    loggedUser:UtenteModel={};
    dipendente:UtenteModel={};
    dipendenteId:string|null=null;
    vantaggi:VantaggioModel[]=[];
    filiali:FilialeModel[]=[];
    modifica:boolean=false;

    constructor(
        private router: Router,
        private route:ActivatedRoute,
        private sessionService: SessionService,
        private dipendenteService:DipendenteControllerService,
        private adminDipService:AdminDipendenteControllerService,
        private vantaggioService:VantaggioControllerService,
        private filialeService:AdminFilialeControllerService
    ) {
    }

    ngOnInit() {
        const user=this.sessionService.getUser();
        if(user){
            this.loggedUser=user;
        }
        else{
            this.router.navigate(["/"]);
        }
        /*if(!this.loggedUser.ruoli?.includes("ADMIN") || this.loggedUser.ruoli?.includes("DIPENDENTE")){
            this.router.navigate(['/']);
        }*/
        this.dipendenteId=this.route.snapshot.paramMap.get("id");
        if(this.dipendenteId){
            this.modifica=true;
            this.adminDipService.getEmployeeById(this.dipendenteId)
                .pipe(map(dto=>mapper.map<ResponseEmployeeDTO,UtenteModel>(dto,'ResponseEmployeeDTO','UtenteModel')))
                .subscribe({
                    next:(res:UtenteModel)=>{
                        this.dipendente=res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento dipendente: "+err);
                    }
                });
        }
        this.vantaggioService.getAllBenefits()
            .pipe(map(dtos=>mapper.mapArray<ResponseBenefitDTO,VantaggioModel>(dtos,'ResponseBenefitDTO','VantaggioModel')))
            .subscribe({
                next:(res:VantaggioModel[])=>{
                    this.vantaggi=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento vantaggi: "+err);
                }
            });
        this.vantaggioService.getAllBenefits()
            .pipe(map(dtos=>mapper.mapArray<ResponseBenefitDTO,VantaggioModel>(dtos,'ResponseBenefitDTO','VantaggioModel')))
            .subscribe({
                next:(res:VantaggioModel[])=>{
                    this.vantaggi=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento vantaggi: "+err);
                }
            });
        this.filialeService.getAllBranches()
            .pipe(map(dtos=>mapper.mapArray<ResponseBranchDTO,FilialeModel>(dtos,'ResponseBranchDTO','FilialeModel')))
            .subscribe({
                next:(res:FilialeModel[])=>{
                    this.filiali=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento filiali: "+err);
                }
            })
    }

    salvaDipendente(){
        this.dipendente.ruoliIds=[];
        this.dipendente.ruoliIds?.push("8a1c0d4f-5b7c-48b8-b4b3-9e9d6d5f47c5");
        if(this.modifica){
            if(this.dipendenteId){
                this.adminDipService.updateEmployee(this.dipendenteId,mapper.map(this.dipendente,'UtenteModel','UpdateEmployeeFromAdminDTO'))
                    .pipe(map(dto=>mapper.map(dto,'ResponseUserDTO','UtenteModel')))
                    .subscribe({
                        next:(res:UtenteModel)=>{
                            this.router.navigate(["/dipendenti"]);
                        },
                        error:(err)=>{
                            console.log("Errore aggiornamento dipendente: "+err);
                        }
                    });
            }
            else{
                console.log("Errore: dipendente non trovato");
            }
        }
        else{
            const employee:CreateEmployeeFromAdminDTO=mapper.map<UtenteModel,CreateEmployeeFromAdminDTO>(this.dipendente,'UtenteModel','CreateEmployeeFromAdminDTO');
            this.adminDipService.createEmployee(employee)
                .pipe(map(dto=>mapper.map<ResponseEmployeeDTO,UtenteModel>(dto,'ResponseEmployeeDTO','UtenteModel')))
                .subscribe({
                    next:(res:UtenteModel)=>{
                        this.router.navigate(["/dipendenti"]);
                    },
                    error:(err)=>{
                        console.log("Errore creazione dipendente: "+err)
                    }
                })
        }
    }
    annulla(){
        this.router.navigate(["/dipendenti"]);
    }
}