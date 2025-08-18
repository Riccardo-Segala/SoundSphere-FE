import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import{SessionService} from "../../services/session.service";
import {Router, RouterModule, Routes} from '@angular/router';
import {AuthenticationControllerService, LoginRequestDTO,JwtResponseDTO} from "../../api-client";
import {HttpContext} from "@angular/common/http";

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

    constructor(private sessionService: SessionService, private router: Router,private authService: AuthenticationControllerService) {
    }

    login(){
        this.errore='';
        this.authService.login(this.credenziali).subscribe({
            next:(response:JwtResponseDTO)=>{
                if(response){
                    //const res:JwtResponseDTO=response;
                    this.sessionService.setLoggedUser(this.credenziali.email as string,response.token as string);
                    this.router.navigate(['/']);
                }else{
                    this.errore='Password Errata';
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