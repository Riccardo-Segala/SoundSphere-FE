import {Component, OnInit} from "@angular/core";
import {DatiStaticiModel} from "../../models/dati-statici.model";
import {UtenteModel} from "../../models/utente.model";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {AdminDatiStaticiControllerService, ResponseStaticDataDTO} from "../../api-client";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {NgForOf} from "@angular/common";
import {FormDatiStaticiComponent} from "./form-dati-statici.component";

@Component({
    selector:'app-dati-statici',
    standalone: true,
    imports: [
        NgForOf,
        FormDatiStaticiComponent
    ],
    templateUrl:'dati-statici.component.html',
    styleUrls:['dati-statici.component.scss']
})
export class DatiStaticiComponent implements OnInit{
    datiStatici:DatiStaticiModel[]=[];
    loggedUser:UtenteModel|null=null;

    constructor(
        private router:Router,
        private session:SessionService,
        private dsService:AdminDatiStaticiControllerService
    ){}

    ngOnInit() {
        this.caricaDatiStatici();
    }

    caricaDatiStatici(){
        this.dsService.getAllDatas()
            .pipe(map(dtos=>mapper.mapArray<ResponseStaticDataDTO,DatiStaticiModel>(dtos,'ResponseStaticDataDTO','DatiStaticiModel')))
            .subscribe({
                next:(res:DatiStaticiModel[])=>{
                    this.datiStatici=res;
                },
                error:(err)=>{
                    console.log("Errore ottenimento dati statici: "+JSON.stringify(err));
                }
            })
    }


}