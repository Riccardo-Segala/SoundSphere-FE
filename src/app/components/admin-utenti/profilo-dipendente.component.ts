import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {
    AdminDipendenteControllerService, AdminFilialeControllerService,
    AdminUtenteControllerService,
    DipendenteControllerService, ResponseBenefitDTO, ResponseBranchDTO,
    ResponseEmployeeDTO, VantaggioControllerService,
    CreateEmployeeFromAdminDTO, ResponseRoleDTO, AdminRuoloControllerService
} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {FormsModule} from "@angular/forms";
import {VantaggioModel} from "../../models/vantaggio.model";
import {FilialeModel} from "../../models/filiale.model";
import {NgForOf, NgIf} from "@angular/common";
import {RuoloModel} from "../../models/ruolo.model";

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
    ruoliSelezionati:RuoloModel[]=[];
    adminRole:RuoloModel|undefined=undefined;

    constructor(
        private router: Router,
        private route:ActivatedRoute,
        private sessionService: SessionService,
        private dipendenteService:DipendenteControllerService,
        private adminDipService:AdminDipendenteControllerService,
        private vantaggioService:VantaggioControllerService,
        private filialeService:AdminFilialeControllerService,
        private ruoloService:AdminRuoloControllerService
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
        else{
            this.modifica=false;
            this.dipendente.filialeId=undefined;
            this.dipendente.sesso="NON_SPECIFICATO";
        }
        this.filialeService.getAllBranches()
            .pipe(map(dtos=>mapper.mapArray<ResponseBranchDTO,FilialeModel>(dtos,'ResponseBranchDTO','FilialeModel')))
            .subscribe({
                next:(res:FilialeModel[])=>{
                    this.filiali=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento filiali: "+err);
                }
            });
        this.ruoloService.getAllRoles()
            .pipe(map(dtos=>mapper.mapArray<ResponseRoleDTO,RuoloModel>(dtos,'ResponseRoleDTO','RuoloModel')))
            .subscribe({
                next:(res:RuoloModel[])=>{
                    this.adminRole=res.find(elemento=>elemento.nome=="ADMIN");
                    if(this.dipendente.ruoli){
                        //casting perchè in mappatura ruoli è un array di classe RuoloModel
                        //ma di fatto è un array di stringhe perchè contiene solo il nome del ruolo
                        const nomiRuoli=this.dipendente.ruoli as unknown as string;
                        this.ruoliSelezionati=res.filter(ruolo=>nomiRuoli.includes(ruolo.nome) || ruolo.nome==="DIPENDENTE");
                    }
                    else{
                        const ruoloDipendente=res.find(ruolo=>ruolo.nome==="DIPENDENTE");
                        if(ruoloDipendente){
                            this.ruoliSelezionati.push(ruoloDipendente);
                        }

                    }
                },
                error:(err)=>{
                    console.log("Errore ruoli: ",JSON.stringify(err));
                }
            });
    }

    salvaDipendente(){
        this.dipendente.ruoli= this.ruoliSelezionati.length>0 ? this.ruoliSelezionati : undefined;
        if(this.modifica){
            if(this.dipendenteId){
                this.adminDipService.updateEmployee(this.dipendenteId,mapper.map(this.dipendente,'UtenteModel','UpdateEmployeeFromAdminDTO'))
                    .pipe(map(dto=>mapper.map(dto,'ResponseUserDTO','UtenteModel')))
                    .subscribe({
                        next:(res:UtenteModel)=>{
                            this.router.navigate(["/utenti"]);
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
                        this.router.navigate(["/utenti"]);
                    },
                    error:(err)=>{
                        console.log("Errore creazione dipendente: "+err)
                    }
                })
        }
    }
    annulla(){
        this.router.navigate(["/utenti"]);
    }

    ruoloSelezionato(){
        if(this.dipendente.ruoli){
            return this.ruoliSelezionati.find(ruolo=>ruolo.nome==="ADMIN");
        }
        return false;
    }
    ruoloCambiato(event:Event){
        const checkbox=event.target as HTMLInputElement;
        if(!this.dipendente.ruoli){
            this.dipendente.ruoli=[];
        }
        if(checkbox.checked && this.adminRole){
            this.ruoliSelezionati.push(this.adminRole);
        }
        else{
            this.ruoliSelezionati=this.ruoliSelezionati.filter(ruolo=>ruolo.nome!=="ADMIN");
        }
    }
}