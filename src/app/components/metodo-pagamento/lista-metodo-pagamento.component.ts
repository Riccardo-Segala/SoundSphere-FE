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
import {FormMetodoPagamentoComponent} from "./form-metodo-pagamento/form-metodo-pagamento.component";

@Component({
    selector: 'app-lista-metodi-pagamento',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, FormMetodoPagamentoComponent],
    templateUrl: './lista-metodo-pagamento.component.html',
    styleUrls:["./lista-metodo-pagamento.component.scss"]
})
export class ListaMetodoPagamentoComponent implements OnInit{
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
            this.caricaMetodi();
        }
    }
    caricaMetodi(){
        this.mpService.getAllUserPaymentMethod()
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
    onSalvaMetodo(nuovoMetodo:MetodoPagamentoModel){
        this.caricaMetodi();
    }
    delete(id:string){
        this.mpService.deletePaymentMethod(id).subscribe({
            next:(res)=>{
                console.log("Cancellazione effettuata: "+res);
                this.caricaMetodi();
            },
            error:(err)=>{
                console.log("Errore cancellazione metodo: "+err);
            }
        });
    }
}