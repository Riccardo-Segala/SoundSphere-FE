import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DatiStaticiModel} from "../../models/dati-statici.model";
import {SessionService} from "../../services/session.service";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map, Observable} from "rxjs";
import {AdminDatiStaticiControllerService, ResponseStaticDataDTO} from "../../api-client";
import {FormsModule} from "@angular/forms";

@Component({
    selector:'form-dati-statici',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl:'form-dati-statici.component.html',
    styleUrls:['form-dati-statici.component.scss']
})
export class FormDatiStaticiComponent{
    @Input() datoStatico:DatiStaticiModel= {id:"",nome:"",valore:0};
    @Input() modifica:boolean=false;
    @Output() datoSalvato=new EventEmitter();

    constructor(
        private dsService:AdminDatiStaticiControllerService
    ) {
    }
    ngOnInit(){

    }

    salva(){
        if(this.datoStatico){
            let api$:Observable<ResponseStaticDataDTO>;
            const datoStaticoDTO=mapper.map(this.datoStatico,'DatiStaticiModel','CreateOrUpdateStaticDataDTO')
            if(this.modifica && this.datoStatico.id){
                api$=this.dsService.updateAdmin(this.datoStatico.id,datoStaticoDTO)
            }
            else{
                api$=this.dsService.createAdmin(datoStaticoDTO);
            }
            api$.pipe(map(dto=>mapper.map<ResponseStaticDataDTO,DatiStaticiModel>(dto,'ResponseStaticDataDTO','DatiStaticiModel')))
                .subscribe({
                    next:()=>{
                        if(!this.modifica)
                            this.datoStatico={id:"",nome:"",valore:0};
                        this.datoSalvato.emit();
                    }
                })
        }
    }
    elimina(id:string|undefined){
        if(id){
            this.dsService.deleteAdmin(id).subscribe({
                next:()=>{
                    console.log("Eliminazione completata");
                },
                error:(err)=>{
                    console.log("Errore eliminazione dato: ",JSON.stringify(err));
                }
            })
        }
    }
}