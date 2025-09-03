import {Component, OnInit} from "@angular/core";
import {UtenteModel} from "../../models/utente.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";

@Component({
    selector: "app-admin-page",
    standalone: true,
    imports:[],
    templateUrl:"./admin-page.component.html",
    styleUrls:["./admin-page.component.scss"]
})
export class AdminPageComponent implements OnInit {
    loggedUser:UtenteModel|null = null;

    constructor(
        private router: Router,
        private session:SessionService
    ) {
    }
    ngOnInit(){
        this.loggedUser=this.session.getUser();
        if(!(this.loggedUser && this.loggedUser.ruoli?.includes("ADMIN"))){
            this.router.navigate(['/']);
        }
    }

    naviga(path:string){
        this.router.navigate([path]);
    }
}