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
        this.addressForm.markAllAsTouched();
        if(this.addressForm.valid){
            this.indirizzo={...this.indirizzo,...this.addressForm.value};
            this.salvaIndirizzo.emit(this.indirizzo);
        }
    }
}
