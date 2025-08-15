import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {CreateUserDTO} from "../../api-client/dto/createUserDTO";
import {AuthenticationControllerService, UtenteControllerService} from "../../api-client";

@Component({
    selector: 'app-registrazione',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl:'./registrazione.component.html',
    styleUrls:['./registrazione.component.scss']
})
export class RegistrazioneComponent {
    utente:CreateUserDTO={};
    pathImmagine='';

    constructor(private http: HttpClient, private router: Router,private sessionService:SessionService,private authService:AuthenticationControllerService, private utenteService: UtenteControllerService) {
    }

    registrazione(){
        const payload=this.utente;
        this.authService.registerUser(payload).subscribe(()=>{
            this.router.navigate(['login']);
        })
    }
    fileSelezionato(event:any){
        const file:File=event.target.files[0];
        //this.utenteService.caricaFile(file);
    }
    annulla(){
        this.router.navigate(['/login']);
    }
}