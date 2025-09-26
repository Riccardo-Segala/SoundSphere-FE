import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {IndirizzoUtenteModel} from "../../models/indirizzo-utente.model";
import {NgIf} from "@angular/common";

@Component({
    selector:'app-form-indirizzi',
    standalone:true,
    imports: [
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl:'form-indirizzi-utente.component.html',
    styleUrls:['form-indirizzi-utente.component.scss']
})
export class FormIndirizziUtenteComponent implements OnInit {
    public addressForm!:FormGroup;
    @Input() modifica:boolean=false;
    @Input() indirizzo:IndirizzoUtenteModel={};
    @Output() salvaIndirizzo = new EventEmitter<IndirizzoUtenteModel>();


    constructor(
        private router:Router,
        private session:SessionService,
        private fb:FormBuilder
    ) {
        //quando il componente viene creato (o meglio, l'istanza della classe) viene anche definita la variabile addressForm
        //che definisce come si devono comportare tutti gli elementi di input del form, in particolare valore di default, se obbligatori e il pattern che devono rispettare.
        //E' utilizzato così e non con il solito binding nel tag perchè deve essere acceduto anche dal componente padre (profilo utente)
        //per inserire un indirizzo anche in fase di registrazione
        this.addressForm = this.fb.group({
            nazione:['',Validators.required],
            provincia:['',Validators.required],
            citta:['',Validators.required],
            cap:['',[Validators.required,Validators.pattern('^\\d{5}$')]],
            via:['',Validators.required],
            civico:['',[Validators.required,Validators.pattern('^\\d{1,3}[A-Za-z]?$')]],
        });


    }

    ngOnInit() {
        this.addressForm = this.fb.group({
            nazione:['',Validators.required],
            provincia:['',Validators.required],
            citta:['',Validators.required],
            cap:['',[Validators.required,Validators.pattern('^\\d{5}$')]],
            via:['',Validators.required],
            civico:['',[Validators.required,Validators.pattern('^\\d{1,3}[A-Za-z]?$')]],
        });
        if(this.indirizzo){
            this.addressForm.patchValue(this.indirizzo);
        }
    }
    ngOnChanges(changes:SimpleChanges) {
        if(changes['indirizzo'] && this.indirizzo){
            this.addressForm.patchValue({id:this.indirizzo.id,...this.indirizzo});
        }
    }
    clear(){
        this.addressForm.reset();
    }
    salva(){
        //markAllAsTouched serve per attivare la verifica dei valori contenuti nelle caselle del form
        this.addressForm.markAllAsTouched();
        if(this.addressForm.valid){
            //aggiorna il valore di indirizzo in modo che prenda i valori del form o, se non definiti, riprenda i propri (es. id non esiste nel form)
            this.indirizzo={...this.indirizzo,...this.addressForm.value};
            this.salvaIndirizzo.emit(this.indirizzo);
        }
    }
}
