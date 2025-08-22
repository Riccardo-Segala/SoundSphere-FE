import {Component, OnInit} from "@angular/core";
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

@Component({
    selector: 'app-registrazione',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl:'./profilo-utente.component.html',
    styleUrls:['./profilo-utente.component.scss']
})
export class ProfiloUtenteComponent {
    utente:CreateUserDTO={
        nome: '',
        cognome: '',
        email: '',
        password: '',
        dataDiNascita: '',
        sesso: 'NON_SPECIFICATO'
    };
    loggedUser:ResponseUserDTO|null={};
    pathImmagine='';
    modifica=false;
    indirizzo:ResponseUserAddressDTO= {};

    userForm:FormGroup;

    constructor(private http: HttpClient,
                private router: Router,
                private route:ActivatedRoute,
                private fb:FormBuilder,
                private sessionService:SessionService,
                private authService:AuthenticationControllerService,
                private utenteService: UtenteControllerService,
                private indirizzoService:IndirizzoUtenteControllerService) {
        this.userForm = this.fb.group({
            nome: ['', Validators.required],
            cognome:['', Validators.required],
            email: ['', Validators.required,Validators.email],
            password: ['', Validators.required,Validators.minLength(8)],
            dataNascita:['', Validators.required],
            sesso: ['', Validators.required],
        })
    }

    ngOnInit(){
        const id=this.route.snapshot.paramMap.get('id');
        if(id){
            this.modifica=true;
            if(this.sessionService.getUser())
                this.loggedUser=this.sessionService.getUser();

        }
    }
    registrazione(){
        const payload=this.utente;

        if(this.modifica){
            this.authService.registerUser(payload).subscribe((res:JwtResponseDTO)=>{
                this.utenteService.getCurrentUser().subscribe(user=>{this.loggedUser=user;
                    this.sessionService.setLoggedUser(this.loggedUser,res.token as string);
                })
            })

            this.indirizzoService.createUserAddress({
                via:this.indirizzo.via,
                civico:this.indirizzo.civico,
                cap:this.indirizzo.cap,
                citta:this.indirizzo.citta,
                provincia:this.indirizzo.provincia,
                nazione:this.indirizzo.nazione,
                isDefault:this.indirizzo.isDefault,
                tipologia:"SPEDIZIONE",
            }).subscribe();
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