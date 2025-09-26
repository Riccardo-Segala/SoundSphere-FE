import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormsModule} from "@angular/forms";
import {SessionService} from "../../../services/session.service";
import {MetodoPagamentoControllerService, ResponsePaymentMethodDTO} from "../../../api-client";
import {MetodoPagamentoModel} from "../../../models/metodo-pagamento.model";
import {mapper} from "../../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
    selector:'app-form-mp',
    standalone: true,
    imports: [
        FormsModule,
        NgIf
    ],
    templateUrl:'form-metodo-pagamento.component.html',
    styleUrls:['form-metodo-pagamento.component.scss']
})
export class FormMetodoPagamentoComponent implements OnInit{
    @Output() salvaMetodo = new EventEmitter<MetodoPagamentoModel>();
    metodo!:MetodoPagamentoModel;
    paypal:boolean=false;
    nome:string='';
    cognome:string='';
    meseAnno:string="";

    constructor(
        private router:Router,
        private session:SessionService,
        private mpService:MetodoPagamentoControllerService
    ) {
    }

    ngOnInit() {
        this.metodo=this.azzeraMetodo();
        this.ottieniMeseAnno();
    }

    ottieniMeseAnno(){
        const oggi:Date=new Date();
        const mese:string=(oggi.getMonth()+1).toString().padStart(2,'0');
        const anno:string=oggi.getFullYear().toString();
        this.meseAnno=anno+"-"+mese;
    }
    salva(){
        this.metodo.nomeSuCarta=this.cognome+" "+this.nome;
        this.mpService.createPaymentMethod(mapper.map(this.metodo,'MetodoPagamentoModel','CreatePaymentMethodDTO'))
            .pipe(map(dto=>mapper.map<ResponsePaymentMethodDTO,MetodoPagamentoModel>(dto,'ResponsePaymentMethodDTO','MetodoPagamentoModel')))
            .subscribe({
            next:(res:MetodoPagamentoModel)=>{
                //azzero tutti i campi del metodo di pagamento
                this.paypal=false;
                this.metodo=this.azzeraMetodo();
                this.nome="";
                this.cognome="";
                this.ottieniMeseAnno();
                this.salvaMetodo.emit();
            },
            error:(err)=>{
                console.log('Errore inserimento metodo: '+ err);
            }
        })
    }
    azzeraMetodo():MetodoPagamentoModel{
        return {
            id:'',
            nomeSuCarta: '',
            numero: '',
            cvv: '',
            dataScadenza: '',
            paypalEmail: '',
            tipoPagamento: 'CARTA_DI_CREDITO',
            main: false
        }
    }

    //per assicurarsi che sia il primo giorno del mese successivo
    dataCambiata(nuovoMeseAnno:string){
        if(!nuovoMeseAnno){
            this.metodo.dataScadenza;
        }

        const [anno,mese]=nuovoMeseAnno.split('-').map(Number);
        const dataSelezionata=new Date(anno,mese-1,1);
        dataSelezionata.setMonth(dataSelezionata.getMonth()+1);

        const nuovoAnno=dataSelezionata.getFullYear().toString();
        const nuovoMese=(dataSelezionata.getMonth()+1).toString().padStart(2,'0');
        const nuovoGiorno='01';
        this.metodo.dataScadenza=`${nuovoAnno}-${nuovoMese}-${nuovoGiorno}`;

        console.log(this.metodo.dataScadenza);
    }
}