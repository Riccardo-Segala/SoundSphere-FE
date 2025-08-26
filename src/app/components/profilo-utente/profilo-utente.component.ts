import {Component, Inject, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {
    CreateUserDTO,
    IndirizzoUtenteControllerService, JwtResponseDTO,
    ResponseUserAddressDTO,
    ResponseUserDTO
} from "../../api-client";
import {AuthenticationControllerService, UtenteControllerService} from "../../api-client";
import {IndirizzoUtenteModel} from "../../models/indirizzo-utente.model";
import {Mapper} from "@automapper/core";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {UtenteModel} from "../../models/utente.model";

@Component({
    selector: 'app-registrazione',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl:'./profilo-utente.component.html',
    styleUrls:['./profilo-utente.component.scss']
})
export class ProfiloUtenteComponent {
    utente:UtenteModel={};
    pathImmagine='';
    modifica:boolean=false;
    indirizzo:IndirizzoUtenteModel[]=[{nazione:""}];


    constructor(private http: HttpClient,
                private router: Router,
                private route:ActivatedRoute,
                private fb:FormBuilder,
                private sessionService:SessionService,
                private authService:AuthenticationControllerService,
                private utenteService: UtenteControllerService,
                private indirizzoService:IndirizzoUtenteControllerService) {
    }

    ngOnInit(){
        const id=this.route.snapshot.paramMap.get('id');
        if(this.router.url.includes("/modifica-profilo")) {
            this.modifica = true;
            if (this.sessionService.getUser()){
                this.indirizzoService.getAllUserAddressesByUserId()
                    .pipe(map(dtos => mapper.mapArray(dtos, 'ResponseUserAddressDTO', 'IndirizzoUtenteModel')))
                    .subscribe({
                        next:(indirizzi:IndirizzoUtenteModel[]) => {
                            this.indirizzo = indirizzi;
                        },
                        error:()=>{
                            console.log("Errore ottenimento indirizzi utente: ");
                        }

                    });

                this.indirizzo[0].tipologia="SPEDIZIONE";
            }
            else{
                this.router.navigate(["/registrazione"]);
            }
        }
        else{
            this.modifica=false;
            this.indirizzo[0].tipologia="SPEDIZIONE";
        }
    }
    registrazione(){
        const payload=this.utente;

        if(!this.modifica){
            this.authService.registerUser(mapper.map(payload,'UtenteModel','CreateUserDTO')).subscribe({
                next:(res:JwtResponseDTO)=>{
                    this.sessionService.setLoggedUser(this.utente,res.token as string);

                    let dto=mapper.map(this.indirizzo[0],'IndirizzoUtenteModel','CreateUserAddressDTO');
                    console.log(JSON.stringify(dto));

                    this.indirizzoService.createUserAddress(mapper.map(this.indirizzo[0],'IndirizzoUtenteModel','CreateUserAddressDTO'))
                        .subscribe({
                            next:(risposta:ResponseUserAddressDTO)=>{
                                this.router.navigate(["/modifica-profilo"]);
                            },
                            error:()=>{
                                console.log("Errore nella creazione dell'indirizzo: ");
                            }
                        })


                },
                error:()=>{
                    console.log("Errore nella registrazione dell'utente: ");
                }
            });
        }
        else{

        }

    }
    fileSelezionato(event:any){
        const file:File=event.target.files[0];
        //this.utenteService.caricaFile(file);
    }
    annulla(){
        this.router.navigate(['/login']);
    }

}