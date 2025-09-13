import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import{SessionService} from "../../services/session.service";
import {Router, RouterModule, Routes} from '@angular/router';
import {
    AuthenticationControllerService,
    LoginRequestDTO,
    JwtResponseDTO,
    ResponseUserDTO,
    UtenteControllerService
} from "../../api-client";
import {HttpClient, HttpContext} from "@angular/common/http";
import {UtenteModel} from "../../models/utente.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";

@Component({
    selector: 'app-login',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.scss']
})
export class LoginComponent {
    errore='';
    credenziali:LoginRequestDTO={
        email: '',
        password: ''
    };
    loggedUser:UtenteModel={};

    constructor(private sessionService: SessionService,
                private router: Router,
                private authService: AuthenticationControllerService,
                private http:HttpClient,
                private userService:UtenteControllerService) {
    }

    login(){
        this.errore='';
        this.authService.login(this.credenziali).subscribe({
            next:(response:JwtResponseDTO)=>{
                if(response){
                    //const res:JwtResponseDTO=response;
                    if(response.token){
                        this.sessionService.setToken(response.token);
                        this.userService.getCurrentUser()
                            .pipe(map(dto=>mapper.map<ResponseUserDTO,UtenteModel>(dto,'ResponseUserDTO','UtenteModel')))
                            .subscribe((utente:UtenteModel)=>{
                                this.loggedUser=utente;
                                this.sessionService.setUser(utente);
                                if(this.loggedUser.ruoli?.some(ruolo=>ruolo.nome==="ADMIN")){
                                    this.router.navigate(['/admin-page']);
                                }
                                else if(this.loggedUser.ruoli?.some(ruolo=>ruolo.nome==="UTENTE" || ruolo.nome==="ORGANIZZATORE_EVENTI")){
                                    this.router.navigate(['/']);
                                }
                                else if(this.loggedUser.ruoli?.some(ruolo=>ruolo.nome=="DIPENDENTE")){
                                    this.router.navigate(['/catalogo-dipendente']);
                                }
                        })
                    }else{
                        this.errore='Password Errata';
                    }
                }
            },error:()=>{
                this.errore='Utente non trovato';
            }
        });
    }
    annulla(){
        this.router.navigate(['/']);
    }
}