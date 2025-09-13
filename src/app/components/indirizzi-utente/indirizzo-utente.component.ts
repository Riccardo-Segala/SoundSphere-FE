import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {Router, RouterModule} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {IndirizzoUtenteModel} from "../../models/indirizzo-utente.model";
import {CreateUserAddressDTO, IndirizzoUtenteControllerService, ResponseUserAddressDTO} from "../../api-client";
import {catchError, map, Observable, of} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {CommonModule, NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UtenteModel} from "../../models/utente.model";
import {FormIndirizziUtenteComponent} from "./form-indirizzi-utente.component";

@Component({
    selector: 'app-address',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, FormIndirizziUtenteComponent],
    templateUrl:'./indirizzo-utente.component.html',
    styleUrls:['./indirizzo-utente.component.scss']
})
export class IndirizzoutenteComponent implements OnInit {
    indirizzi:IndirizzoUtenteModel[]=[];
    loggedUser:UtenteModel={};
    @ViewChild(FormIndirizziUtenteComponent) public addressForm!:FormIndirizziUtenteComponent;
    @Input() modifica:boolean=false;
    idModifica:string|null=null;

    constructor(
        private router:Router,
        private session:SessionService,
        private indirizzoService:IndirizzoUtenteControllerService,
        private fb: FormBuilder,
    ){}

    ngOnInit() {
        const user=this.session.getUser();
        if(user)
        {
            this.loggedUser=user as UtenteModel;
            this.caricaListaIndirizzi();
        }
    }

    salva(indirizzo:IndirizzoUtenteModel){
        if(indirizzo.id){
            this.indirizzoService.updateUserAddress(indirizzo.id,mapper.map(indirizzo,'IndirizzoUtenteModel','UpdateUserAddressDTO'))
                .pipe()
                .subscribe({
                    next:(res)=>{
                        this.caricaListaIndirizzi();
                    },
                    error:(err)=>{
                        console.log("Errore aggiornamento indirizzo: "+err);
                    }
                })
        }
        else{
            if(!this.modifica){
                indirizzo.main=true;
                indirizzo.tipologia="RESIDENZA";
            }
            this.indirizzoService.createUserAddress(mapper.map(indirizzo,'IndirizzoUtenteModel','CreateUserAddressDTO'))
                .pipe()
                .subscribe({
                    next:(res)=>{
                        this.caricaListaIndirizzi();
                        this.addressForm.addressForm.reset();
                    },
                    error:(err)=>{
                        console.log("Errore inserimento nuovo indirizzo: "+err);
                    }
                })
        }
    }

    eliminaIndirizzo(id:string|undefined){
        if(id){
            this.indirizzoService.deleteUserAddress(id).subscribe({
                next:(res)=>{
                    console.log("Eliminazione effettuata con successo");
                    this.caricaListaIndirizzi();
                },
                error:(err)=>{
                    console.log("Errore eliminazione indirizzo");
                }
            })
        }
    }

    indirizzoInModifica(id:string|undefined){
        if(id){
            if(id!==this.idModifica){
                this.idModifica=id;
            }
            else if(id===this.idModifica){
                this.idModifica=null;
            }
        }
    }
    caricaListaIndirizzi(){
        this.indirizzoService.getAllUserAddressesByUserId()
            .pipe(map(dtos=>mapper.mapArray<ResponseUserAddressDTO,IndirizzoUtenteModel>(dtos,'ResponseUserAddressDTO','IndirizzoUtenteModel')))
            .subscribe({
                next:(indirizzi:IndirizzoUtenteModel[])=>{
                    this.indirizzi=indirizzi;
                    this.idModifica=null;
                },
                error:(err)=>{
                    console.log("Errore ottenimento indirizzi: "+err);
                }
            });
    }
}