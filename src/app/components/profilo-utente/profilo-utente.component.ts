import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {
    CreateUserDTO, ImageUploadControllerService,
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
import {FormIndirizziUtenteComponent} from "../indirizzi-utente/form-indirizzi-utente.component";

@Component({
    selector: 'app-profilo',
    standalone:true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FormIndirizziUtenteComponent],
    templateUrl:'./profilo-utente.component.html',
    styleUrls:['./profilo-utente.component.scss']
})
export class ProfiloUtenteComponent implements OnInit{
    utente:UtenteModel={};
    pathImmagine='';
    modifica:boolean=false;
    previewUrl:string|ArrayBuffer|null='/images/placeholder-utente';

    //puo accedere al form del figlio. static:false permette ad angular di rendere disponibile il form dopo che è
    //stata completamente inizializzata e controllata la vista
    // ! è  per dire al compilatore di "stare tranquillo" e che la variabile verrà inizializzata ad un certo punto
    @ViewChild('formIndirizzo',{static:false}) private addressFormComponent!:FormIndirizziUtenteComponent;
    profileForm!:FormGroup;

    constructor(
        private http: HttpClient,
        private router: Router,
        private route:ActivatedRoute,
        private fb:FormBuilder,
        private sessionService:SessionService,
        private authService:AuthenticationControllerService,
        private utenteService:UtenteControllerService,
        private indirizzoService:IndirizzoUtenteControllerService,
        private imageUploadService:ImageUploadControllerService
    ) {
    }

    ngOnInit(){
        /*
        * utilizzo di formBuilder per poter controllare in un'unica volta i campi sia del form utente che form indirizzo
        * */
        this.profileForm = this.fb.group({
            nome:['',Validators.required],
            cognome:['',Validators.required],
            email:['',[Validators.required,Validators.email]],
            dataDiNascita:['',Validators.required],
            sesso:['NON_SPECIFICATO',Validators.required],

            pathImmagine:[this.previewUrl],
            imageFile:[null]
        });

        //const id=this.route.snapshot.paramMap.get('id');
        if(this.router.url.includes("/modifica-profilo")) {
            this.modifica = true;
            if (this.sessionService.getUser()){
                this.utente=this.sessionService.getUser() as UtenteModel;
                this.profileForm.patchValue(this.utente);
                if(this.utente.pathImmagine) {
                    this.previewUrl = this.utente.pathImmagine;
                }
            }
            else{
                this.router.navigate(["/registrazione"]);
            }
        }
        else{
            this.modifica=false;
            //aggiunge il controllo per inserire la password
            this.profileForm.addControl(
                'password',
                this.fb.control('', [Validators.required, Validators.minLength(8),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$")])
            );
        }
    }
    get isFormInvalid():boolean{
        if(this.modifica){
            return this.profileForm.invalid;
        }
        else{
            //controlla sia la validità del form utente che l'esistenza e la validità del form indirizzo
            return this.profileForm.invalid || (this.addressFormComponent && this.addressFormComponent.addressForm.invalid);
        }
    }
    registrazione(){
        this.profileForm.markAllAsTouched();
        this.addressFormComponent?.addressForm.markAllAsTouched();
        if(this.isFormInvalid){
            console.log("Form Invalido");
            return;
        }

        this.utente={...this.utente,...this.profileForm.value};
        if(this.previewUrl) {
            this.utente.pathImmagine = this.previewUrl as string;
        }
        if(!this.modifica){
            this.authService.registerUser(mapper.map(this.utente,'UtenteModel','CreateUserDTO')).subscribe({
                next:(res:JwtResponseDTO)=>{
                    if(res.token){
                        this.sessionService.setToken(res.token);
                        //importante settare prima il token nella sessione, altrimenti è impossibile inserire l'indirizzo
                        let indirizzo:IndirizzoUtenteModel=this.addressFormComponent.addressForm.value;
                        indirizzo.main=true;
                        indirizzo.tipologia="RESIDENZA";
                        this.indirizzoService.createUserAddress(mapper.map(indirizzo,'IndirizzoUtenteModel','CreateUserAddressDTO'))
                            .subscribe({
                                next:(res)=>{
                                    console.log("Indirizzo creato: "+JSON.stringify(res));
                                    this.utenteService.getCurrentUser()
                                        .pipe(map(dto=>mapper.map<ResponseUserDTO,UtenteModel>(dto,'ResponseUserDTO','UtenteModel')))
                                        .subscribe({
                                            next:(res:UtenteModel)=>{
                                                this.sessionService.setUser(res);
                                            },
                                            error:(err)=>{
                                                console.log("Errore salvataggio utente in sessione: "+err);
                                            }
                                        });
                                    this.router.navigate(["/"]);
                                },
                                error:(err)=>{
                                    console.log("Errore inserimento indirizzo: "+err);
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
            this.utenteService.updateCurrentUser(mapper.map(this.utente,'UtenteModel','UpdateUserDTO'))
                .pipe(map(dto=>mapper.map<ResponseUserDTO,UtenteModel>(dto,'ResponseUserDTO','UtenteModel')))
                .subscribe({
                    next:(res:UtenteModel)=>{
                        this.sessionService.setUser(res);
                        this.utente=res;
                        this.profileForm.patchValue(this.utente);
                    },
                    error:(err)=>{
                        console.log("Errore salvataggio dati utente: "+err);
                    }
                })
        }
    }
    annulla(){
        this.router.navigate(['/login']);
    }

    fileSelezionato(event:any){
        const img:File=event.target.files[0];
        if(!img){
            return;
        }
        this.profileForm.patchValue({
            imageFile:img
        });
        const reader=new FileReader();
        reader.onload=()=>this.previewUrl=reader.result;
        reader.readAsDataURL(img);

        this.imageUploadService.uploadImage(img).subscribe({
            next:(res:any)=>{
                //this.utente.pathImmagine=res.path;
                this.previewUrl=res.path;
            },
            error:(err)=>{
                console.log("Errore caricamento immagine: ",JSON.stringify(err));
            }
        });
    }

}