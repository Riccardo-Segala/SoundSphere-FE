import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {IndirizzoutenteComponent} from "../indirizzi-utente/indirizzo-utente.component";
import {ListaMetodoPagamentoComponent} from "../metodo-pagamento/lista-metodo-pagamento.component";

@Component({
    selector: 'app-profilo',
    standalone:true,
    imports: [CommonModule, FormsModule, IndirizzoutenteComponent, ReactiveFormsModule, ListaMetodoPagamentoComponent],
    templateUrl:'./profilo-utente.component.html',
    styleUrls:['./profilo-utente.component.scss']
})
export class ProfiloUtenteComponent {
    utente:UtenteModel={};
    pathImmagine='';
    modifica:boolean=false;
    indirizzi:IndirizzoUtenteModel[]=[{nazione:""}];

    @ViewChild(IndirizzoutenteComponent) private addressComponent!:IndirizzoutenteComponent;
    profileForm!:FormGroup;

    constructor(private http: HttpClient,
                private router: Router,
                private route:ActivatedRoute,
                private fb:FormBuilder,
                private sessionService:SessionService,
                private authService:AuthenticationControllerService) {
    }

    ngOnInit(){
        //this.sessionService.clearLoggedUser();
        this.profileForm = this.fb.group({
            pathImmagine:[''],
            nome:['',Validators.required],
            cognome:['',Validators.required],
            email:['',[Validators.required,Validators.email]],
            //password:['',this.modifica?[]:[Validators.required,Validators.minLength(8)]],
            dataDiNascita:['',Validators.required],
            sesso:['NON_SPECIFICATO',Validators.required]
        });

        //const id=this.route.snapshot.paramMap.get('id');
        if(this.router.url.includes("/modifica-profilo")) {
            this.modifica = true;
            if (this.sessionService.getUser()){
                this.utente=this.sessionService.getUser() as UtenteModel;
                this.profileForm.patchValue(this.utente);
                /*this.indirizzoService.getAllUserAddressesByUserId()
                    .pipe(map(dtos => mapper.mapArray(dtos, 'ResponseUserAddressDTO', 'IndirizzoUtenteModel')))
                    .subscribe({
                        next:(indirizzi:IndirizzoUtenteModel[]) => {
                            this.indirizzi = indirizzi;
                        },
                        error:()=>{
                            console.log("Errore ottenimento indirizzi utente: ");
                        }
                    });*/
            }
            else{
                this.router.navigate(["/registrazione"]);
            }
        }
        else{
            this.modifica=false;
            this.profileForm.addControl(
                'password',
                this.fb.control('', [Validators.required, Validators.minLength(8)])
            );
        }
    }
    get isFormInvalid():boolean{
        if(this.modifica){
            return this.profileForm.invalid;
        }
        else{
            return this.profileForm.invalid || (this.addressComponent && this.addressComponent.addressForm.invalid);
        }
    }
    registrazione(){
        if(this.isFormInvalid){
            console.log("Form Invalid");
            this.profileForm.markAllAsTouched();
            if(!this.modifica)
                this.addressComponent?.addressForm.markAllAsTouched();
            return;
        }


        const payload=this.profileForm.value;

        if(!this.modifica){
            this.authService.registerUser(mapper.map(payload,'UtenteModel','CreateUserDTO')).subscribe({
                next:(res:JwtResponseDTO)=>{
                    if(res.token){
                        this.sessionService.setToken(res.token);
                        this.addressComponent.inserisciIndirizzo().subscribe({
                            next:(salvato:boolean)=>{
                                if(salvato){
                                    console.log("Indirizzo salvato con successo");
                                    this.sessionService.setUser(this.profileForm.value);
                                    this.router.navigate(["/"]);
                                }
                                else{
                                    console.log("Errore inserimento indirizzo");
                                    this.sessionService.clearLoggedUser();
                                }
                            },
                            error:(err)=>{
                                console.log("Errore metodo indirizzi: "+err);
                                this.sessionService.clearLoggedUser();
                            }
                        })
                    }
                },
                error:()=>{
                    console.log("Errore nella registrazione dell'utente: ");
                }
            });
        }
        else{
            /*this.utenteService.updateUser(mapper.map(payload,'UtenteModel','CreateUserDTO'))
                .pipe(map(dto=>mapper.map(dto,'ResponseUserDTO','UtenteModel')))
                .subscribe({
                    next:(res:UtenteModel)=>{
                        this.sessionService.setUser(res);
                    },
                    error:(err)=>{
                        console.log("Errore aggiornamento profilo: "+err);
                    }
            })*/
        }
    }
    annulla(){
        this.router.navigate(['/login']);
    }

}