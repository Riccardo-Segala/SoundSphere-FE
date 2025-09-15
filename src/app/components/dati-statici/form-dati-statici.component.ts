import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DatiStaticiModel} from "../../models/dati-statici.model";
import {SessionService} from "../../services/session.service";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map, Observable} from "rxjs";
import {AdminDatiStaticiControllerService, ResponseStaticDataDTO} from "../../api-client";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
    selector:'form-dati-statici',
    standalone: true,
    imports: [
        FormsModule,
        NgIf
    ],
    templateUrl:'form-dati-statici.component.html',
    styleUrls:['form-dati-statici.component.scss']
})
export class FormDatiStaticiComponent{
    @Input() datoStatico:DatiStaticiModel= {id:"",nome:"",valore:0};
    @Input() modifica:boolean=false;
    @Output() datoCambiato=new EventEmitter();

    constructor(
        private dsService:AdminDatiStaticiControllerService
    ) {
    }

    salva(){
        if(this.datoStatico){
            let api$:Observable<ResponseStaticDataDTO>;
            const datoStaticoDTO=mapper.map(this.datoStatico,'DatiStaticiModel','CreateOrUpdateStaticDataDTO')
            if(this.modifica && this.datoStatico.id){
                api$=this.dsService.updateData(this.datoStatico.id,datoStaticoDTO)
            }
            else{
                api$=this.dsService.createData(datoStaticoDTO);
            }
            api$.pipe(map(dto=>mapper.map<ResponseStaticDataDTO,DatiStaticiModel>(dto,'ResponseStaticDataDTO','DatiStaticiModel')))
                .subscribe({
                    next:()=>{
                        if(!this.modifica)
                            this.datoStatico={id:"",nome:"",valore:0};
                        this.datoCambiato.emit();
                    }
                })
        }
    }
    elimina(id:string|undefined){
        if(id){
            this.dsService.deleteData(id).subscribe({
                next:()=>{
                    console.log("Eliminazione completata");
                    this.datoCambiato.emit();
                },
                error:(err)=>{
                    console.log("Errore eliminazione dato: ",JSON.stringify(err));
                }
            })
        }
    }
}