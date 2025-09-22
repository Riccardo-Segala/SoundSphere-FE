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
    loggedUser:UtenteModel|null = null;
    paypal:boolean=false;

    constructor(
        private router: Router,
        private sessionService: SessionService,
        private mpService:MetodoPagamentoControllerService
    ) {
    }

    ngOnInit() {
        this.loggedUser=this.sessionService.getUser();
        if(this.loggedUser){
            this.caricaMetodi();
        }
        else{
            this.router.navigate(['/']);
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
        const conferma=window.confirm("Sei sicuro di eliminarlo?");
        if(conferma){
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

    impostaPredefinito(id:string|undefined){
        if(id){
            const aggiornaMetodo:MetodoPagamentoModel|undefined=this.metodi.find(metodo=>metodo.id===id);
            if(aggiornaMetodo){
                const index=this.metodi.indexOf(aggiornaMetodo);
                aggiornaMetodo.main=true;
                this.mpService.updatePaymentMethod(id,mapper.map(aggiornaMetodo,'MetodoPagamentoModel','UpdatePaymentMethodDTO'))
                    .subscribe({
                        next:()=>{
                            this.caricaMetodi();
                        },
                        error:(err)=>{
                            console.log("Errore aggiornamento metodo di pagamento: ",JSON.stringify(err));
                        }
                    });
            }
        }
    }
}