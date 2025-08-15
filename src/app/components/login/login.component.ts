import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import{SessionService} from "../../services/session.service";
import {Router, RouterModule, Routes} from '@angular/router';
import {AuthService} from "../../services/auth-service.service";

@Component({
    selector: 'app-login',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.scss']
})
export class LoginComponent {
    errore='';
    email:string='';
    password:string='';

    constructor(private sessionService: SessionService, private router: Router,private authService: AuthService) {
    }

    login(){
        this.errore='';
        this.authService.getUserByEmail(this.email,this.password).subscribe({
            next:(response)=>{
                if(response){
                    this.sessionService.setLoggedUser(this.email,response.token);
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