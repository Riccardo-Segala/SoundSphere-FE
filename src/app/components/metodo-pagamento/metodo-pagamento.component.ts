import {Component, Input, OnInit} from "@angular/core";
import {Router, RouterModule} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {MetodoPagamentoControllerService, ResponsePaymentMethodDTO} from "../../api-client";
import {MetodoPagamentoModel} from "../../models/metodo-pagamento.model";
import {UtenteModel} from "../../models/utente.model";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-metodo-pagamento',
    standalone: true,
    imports:[CommonModule,FormsModule,RouterModule],
    templateUrl: './metodo-pagamento.component.html',
    styleUrls:["./metodo-pagamento.component.scss"]
})
export class MetodoPagamentoComponent implements OnInit{
    metodi:MetodoPagamentoModel[]=[];
    nuovoMetodo!:MetodoPagamentoModel;
    loggedUser:UtenteModel|null = null;
    @Input() modifica:boolean=false;
    modificaMP:boolean=false;
    paypal:boolean=false;

    constructor(
        private router: Router,
        private sessionService: SessionService,
        private mpService:MetodoPagamentoControllerService
    ) {
    }

    ngOnInit() {
        if(this.modifica){
            this.mpService.getAllPaymentMethod()
                .pipe(map(dtos=>mapper.mapArray<ResponsePaymentMethodDTO,MetodoPagamentoModel>(dtos,'ResponsePaymentMethodDTO','MetodoPagamentoModel')))
                .subscribe({
                    next:(res:MetodoPagamentoModel[])=>{
                        this.metodi = res;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento metodi di pagamento: "+err);
                    }
                });
        }
    }
    update(id:string){
        const mp=this.metodi.find(m=>m.id=id);
        if(mp){
            this.nuovoMetodo=mp;
            this.modificaMP=true;
        }
    }
}