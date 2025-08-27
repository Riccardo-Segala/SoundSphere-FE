import {Component, Input, OnInit} from "@angular/core";
import {Router, RouterModule} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {IndirizzoUtenteModel} from "../../models/indirizzo-utente.model";
import {CreateUserAddressDTO, IndirizzoUtenteControllerService, ResponseUserAddressDTO} from "../../api-client";
import {catchError, map, Observable, of} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {CommonModule, NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UtenteModel} from "../../models/utente.model";

@Component({
    selector: 'app-address',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    templateUrl:'./indirizzo-utente.component.html',
    styleUrls:['./indirizzo-utente.component.scss']
})
export class IndirizzoutenteComponent implements OnInit {
    indirizzi:IndirizzoUtenteModel[]=[];
    nuovoIndirizzo:IndirizzoUtenteModel={};
    loggedUser:UtenteModel={};
    public addressForm!:FormGroup;
    @Input() modifica:boolean=false;

    constructor(
        private router:Router,
        private session:SessionService,
        private indirizzoService:IndirizzoUtenteControllerService,
        private fb: FormBuilder,
    ){}

    ngOnInit() {
        this.addressForm = this.fb.group({
            nazione:['',Validators.required],
            provincia:['',Validators.required],
            citta:['',Validators.required],
            cap:['',[Validators.required,Validators.pattern('^\\d{5}$')]],
            via:['',Validators.required],
            civico:['',[Validators.required,Validators.pattern('^\\d{1,3}[A-Za-z]?$')]],
        });
        if(this.session.getUser())
        {
            this.loggedUser=this.session.getUser() as UtenteModel;
            this.indirizzoService.getAllUserAddressesByUserId()
                .pipe(map(dtos=>mapper.mapArray<ResponseUserAddressDTO,IndirizzoUtenteModel>(dtos,'ResponseUserAddressDTO','IndirizzoUtenteModel')))
                .subscribe({
                    next:(indirizzi:IndirizzoUtenteModel[])=>{
                        this.indirizzi=indirizzi;
                    },
                    error:(err)=>{
                        console.log("Errore ottenimento indirizzi: "+err);
                    }
                });
        }
    }

    public inserisciIndirizzo():Observable<boolean>{
        this.addressForm.markAsTouched();
        if(this.addressForm.invalid){
            return of(false);
        }
        this.nuovoIndirizzo=this.addressForm.value;
        const indirizzoDTO=mapper.map<IndirizzoUtenteModel,CreateUserAddressDTO>(this.nuovoIndirizzo,'IndirizzoUtenteModel','CreateUserAddressDTO');
        indirizzoDTO.tipologia="RESIDENZA";
        indirizzoDTO.main=true;
        return this.indirizzoService.createUserAddress(indirizzoDTO)
            .pipe(map(dto=>{
                const nuovoIndirizzo=mapper.map(dto,'ResponseUserAddressDTO','IndirizzoUtenteModel');
                this.indirizzi.push(nuovoIndirizzo);
                return true;
            }),
            catchError(err=>{
                console.log("Errore creazione nuovo indirizzo: "+err);
                return of(false);
            })
            );
    }
}