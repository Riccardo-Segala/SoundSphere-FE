import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {MetodoPagamentoControllerService} from "../../api-client";
import {MetodoPagamentoModel} from "../../models/metodo-pagamento.model";
import {UtenteModel} from "../../models/utente.model";

@Component({
    selector: 'app-metodo-pagamento',
    standalone: true,
    imports:[],
    templateUrl: './metodo-pagamento.componet.html',
    styleUrls:["metodo-pagamento.component.scss"]
})
export class MetodoPagamentoComponent implements OnInit{
    metodi:MetodoPagamentoModel[]=[];
    nuovoMetodo!:MetodoPagamentoModel;
    loggedUser:UtenteModel|null = null;

    constructor(
        private router: Router,
        private sessionService: SessionService,
        private mpService:MetodoPagamentoControllerService
    ) {
    }

    ngOnInit() {
        if(this.loggedUser){
            //
        }
        else{
            this.router.navigate(["/"]);
        }
    }
}