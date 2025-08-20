import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { SessionService } from './services/session.service';
import {HttpClient} from "@angular/common/http";
import {ProdottoControllerService} from "./api-client";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [CommonModule,RouterOutlet, RouterLink,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    loggedUser:string|null=null;
    title='frontend';

    constructor(private http:HttpClient,public router:Router,private session:SessionService,private prodottoService: ProdottoControllerService) {
    }
    ngOnInit() {
        //this.loggedUser=this.session.getLoggedUser();
        //riceve il valore ogni volta che la variabile user$ viene aggiornata nel session service
        //tipo chiamata asincrona di API
        this.session.user$.subscribe(u=>this.loggedUser=u);
    }
    logout() :void {
        this.session.clearLoggedUser();
        this.loggedUser=this.session.getLoggedUser();
        this.router.navigate(['/']);
    }
}
