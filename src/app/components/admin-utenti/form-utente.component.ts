import {Component, OnInit} from "@angular/core";
import {UtenteModel} from "../../models/utente.model";
import {SessionService} from "../../services/session.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
    AdminRuoloControllerService,
    AdminUtenteControllerService, CreateUserFromAdminDTO, ImageUploadControllerService,
    ResponseBenefitDTO, ResponseRoleDTO,
    ResponseUserDTO,
    VantaggioControllerService
} from "../../api-client";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormIndirizziUtenteComponent} from "../indirizzi-utente/form-indirizzi-utente.component";
import {IndirizzoutenteComponent} from "../indirizzi-utente/indirizzo-utente.component";
import {ListaMetodoPagamentoComponent} from "../metodo-pagamento/lista-metodo-pagamento.component";
import {NgForOf, NgIf} from "@angular/common";
import {VantaggioModel} from "../../models/vantaggio.model";
import {RuoloModel} from "../../models/ruolo.model";

@Component({
    selector: "app-form-utente",
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgForOf
    ],
    templateUrl:'form-utente.component.html',
    styleUrls:['form-utente.component.scss']
})
export class FormUtenteComponent implements OnInit{
    loggedUser:UtenteModel|null=null;
    utente:UtenteModel={};
    modifica:boolean=false;
    id:string|null=null;
    vantaggi:VantaggioModel[]=[];
    ruoli:RuoloModel[]=[];
    ruoliSelezionati:RuoloModel[]=[];
    previewUrl:string|ArrayBuffer|null='/images/placeholder-utente';

    constructor(
        private session:SessionService,
        private router:Router,
        private route:ActivatedRoute,
        private adminUtenteService:AdminUtenteControllerService,
        private vantaggioService:VantaggioControllerService,
        private ruoloService:AdminRuoloControllerService,
        private imageUploadService:ImageUploadControllerService
    ) {
    }

    ngOnInit() {
        this.id=this.route.snapshot.paramMap.get("id");
        this.loggedUser=this.session.getUser();
        if(this.loggedUser){
            if(this.id){
                this.modifica=true;
                this.adminUtenteService.getUserById(this.id)
                    .pipe(map(dto=>mapper.map<ResponseUserDTO,UtenteModel>(dto,'ResponseUserDTO','UtenteModel')))
                    .subscribe({
                        next:(res:UtenteModel)=>{
                            this.utente=res;
                            if(res.pathImmagine) {
                                this.previewUrl = res.pathImmagine;
                            }
                            this.caricaRuoli();
                        },
                        error:(err)=>{
                            console.log("Errore ottenimento utente: "+err);
                        }
                    })
            }
            else{
                this.modifica=false;
                this.utente.sesso="NON_SPECIFICATO";
                this.caricaRuoli();
            }
            this.vantaggioService.getAllBenefits()
                .pipe(map(dtos=>mapper.mapArray<ResponseBenefitDTO,VantaggioModel>(dtos,'ResponseBenefitDTO','VantaggioModel')))
                .subscribe({
                    next:(res:VantaggioModel[])=>{
                        this.vantaggi=res;
                        if(!this.utente.vantaggio){
                            this.utente.vantaggio=res.find(vantaggio=>vantaggio.nome==="Base");
                        }
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento vantaggi");
                    }
                })
        }
        else{
            this.router.navigate(['/']);
        }
    }
    confronta(v1:VantaggioModel,v2:VantaggioModel):boolean{
        return v1 && v2 ? v1.id===v2.id : v1===v2;
    }

    caricaRuoli(){
        this.ruoloService.getAllRoles()
            .pipe(map(dtos=>mapper.mapArray<ResponseRoleDTO,RuoloModel>(dtos,'ResponseRoleDTO','RuoloModel')))
            .subscribe({
                next:(res:RuoloModel[])=>{
                    this.ruoli=res.filter(ruolo=>ruolo.nome!=="DIPENDENTE");
                    const nomiRuoli=this.utente.ruoli?.map(r=>r.nome)||[];
                    this.ruoliSelezionati=this.ruoli.filter(ruolo=>nomiRuoli.includes(ruolo.nome));

                    const adminRole=res.find(ruolo=>ruolo.nome==="UTENTE");
                    if(this.ruoliSelezionati.length===0 && adminRole){
                        this.ruoliSelezionati.push(adminRole);
                    }
                },
                error:(err)=>{
                    console.log("Errore ottenimento ruoli: "+err);
                }
            });
    }

    ruoloCambiato(event:Event){
        const checkbox=event.target as HTMLInputElement;
        const ruoloId:string=checkbox.value;
        if(checkbox.checked){
            const ruolo=this.ruoli.find(ruolo=>ruolo.id===ruoloId)
            if(ruolo){
                this.ruoliSelezionati.push(ruolo);
            }
        }
        else{
            this.ruoliSelezionati=this.ruoliSelezionati.filter(role=>role.id !== ruoloId);
        }
    }
    ruoloSelezionato(id:string){
        return this.ruoliSelezionati.find(r=>r.id===id)
    }

    salva(){
        this.utente.ruoli=this.ruoliSelezionati.length ? this.ruoliSelezionati : undefined;
        if(this.id){
            this.adminUtenteService.updateUser(this.id,mapper.map(this.utente,'UtenteModel','UpdateUserFromAdminDTO'))
                .pipe(map(dto=>mapper.map<ResponseUserDTO,UtenteModel>(dto,'ResponseUserDTO','UtenteModel')))
                .subscribe({
                    next:(res:UtenteModel)=>{
                        this.utente=res;
                        this.router.navigate(['utenti']);
                    },
                    error:(err)=>{
                        console.log("Errore aggiornamento utente");
                    }
                })
        }
        else{
            const userDto:CreateUserFromAdminDTO=mapper.map(this.utente,'UtenteModel','CreateUserFromAdminDTO')
            this.adminUtenteService.createUser(userDto)
                .pipe(map(dto=>mapper.map<ResponseUserDTO,UtenteModel>(dto,'ResponseUserDTO','UtenteModel')))
                .subscribe({
                    next:(res:UtenteModel)=>{
                        this.utente=res;
                        this.router.navigate(['utenti']);
                    },
                    error:(err)=>{
                        console.log("Errore inserimento utente");
                    }
                })
        }
    }

    annulla(){
        this.router.navigate(['utenti']);
    }

    fileSelezionato(event:any){
        const img:File=event.target.files[0];
        if(!img){
            return;
        }
        const reader=new FileReader();
        reader.onload=()=>this.previewUrl=reader.result;
        reader.readAsDataURL(img);

        this.imageUploadService.uploadImage(img).subscribe({
            next:(res:any)=>{
                this.utente.pathImmagine=res.path;
                this.previewUrl=res.path;
            },
            error:(err)=>{
                console.log("Errore caricamento immagine: ",JSON.stringify(err));
            }
        });
    }
}