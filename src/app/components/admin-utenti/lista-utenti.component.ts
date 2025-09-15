import {Component, OnInit} from "@angular/core";
import {UtenteModel} from "../../models/utente.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {AdminUtenteControllerService, ResponseUserDTO, UserIdListDTO} from "../../api-client";
import {map} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: "app-lista-utenti",
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        FormsModule
    ],
    templateUrl:'lista-utenti.component.html',
    styleUrls:['lista-utenti.component.scss']
})
export class ListaUtentiComponent implements OnInit {
    utenti:UtenteModel[]=[];
    utentiFiltrati:UtenteModel[]=[];
    utente:UtenteModel|null=null;
    idUtentiDaPromuovere:string[]=[];
    idUtentiDaDegradare:string[]=[];
    idModifica:string|null=null;
    tipologia:string="TUTTI";

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private session: SessionService,
        private adminUtenteService:AdminUtenteControllerService
    ) {
    }

    ngOnInit() {
        this.utente=this.session.getUser();
        if(this.utente && this.utente.ruoli?.map(ruolo=>ruolo.nome).includes("ADMIN")){
            this.caricaUtenti();
        }
        else{
            this.router.navigate(['/']);
        }
    }
    caricaUtenti(){
        this.adminUtenteService.getAllUsers()
            .pipe(map(dtos=>mapper.mapArray<ResponseUserDTO,UtenteModel>(dtos,'ResponseUserDTO','UtenteModel')))
            .subscribe({
                next: (res:UtenteModel[])=> {
                    this.utenti=res.filter(user=>user.id!==this.utente?.id);
                    this.utentiFiltrati=this.utenti;
                },
                error:(err)=>{
                    console.log("Errore ottenimento utenti: "+err);
                }
            });
    }
    filtraUtenti(){
        this.utentiFiltrati=this.utenti;
        if(this.tipologia!=="TUTTI"){
            for(let u of this.utentiFiltrati){
                console.log(u.tipologia==this.tipologia);
            }
            const uf=this.utenti.filter(utente=>utente.tipologia==this.tipologia);
            this.utentiFiltrati=this.utenti.filter(utente=>utente.tipologia==this.tipologia);
        }
    }

    naviga(id:string|undefined,tipologia:string|undefined){
        if(tipologia){
            const path=tipologia==="DIPENDENTE" ? "dipendenti" : "utenti";
            if(id){
                this.router.navigate([path,'modifica',id]);
            }else{
                this.router.navigate([path,'crea']);
            }
        }
    }

    elimina(id:string|undefined){
        if(id){
            this.adminUtenteService.deleteUser(id).subscribe({
                next: ()=>{
                    this.caricaUtenti();
                },
                error:(err)=>{
                    console.log("Errore eliminazione utente: "+JSON.stringify(err));
                }
            })
        }
    }

    addPromossi(id:string){
        if(id){
            this.idUtentiDaPromuovere.push(id);
        }
    }

    promuovi(){
        const promoteDTO:UserIdListDTO={userIdList:this.idUtentiDaPromuovere};
        this.adminUtenteService.promoteUsersToOrganizers(promoteDTO).subscribe({
            next:(res)=>{
                console.log("Promozioni eseguite: ",JSON.stringify(res));
                this.idUtentiDaPromuovere=[];
                this.caricaUtenti();
            },
            error:(err)=>{
                console.log("Promozioni eseguite: ",JSON.stringify(err));
            }
        })
    }

    daPromuovere(id:string) {
        return this.idUtentiDaPromuovere.find(elemento=>elemento===id);
    }

    addDegrada(id:string){
        if(id){
            this.idUtentiDaDegradare.push(id);
        }
    }

    degrada(){
        const demoteDTO:UserIdListDTO={userIdList:this.idUtentiDaDegradare};
        this.adminUtenteService.demoteOrganizersToUsers(demoteDTO).subscribe({
            next:(res)=>{
                console.log("Degradazione completata: ",JSON.stringify(res));
                this.idUtentiDaDegradare=[];
                this.caricaUtenti();
            }
        })
    }
    daDegradare(id:string){
        return this.idUtentiDaDegradare.find(elemento=>elemento===id);
    }

    toggleDocumenti(id:string|undefined){
        if(id){
            if(id!==this.idModifica){
                this.idModifica=id;
            }
            else if(id===this.idModifica){
                this.idModifica=null;
            }
        }
    }

    isOrganizzatore(id:string|undefined):boolean{
        if(id){
            const utente=this.utenti.find(utente=>utente.id===id);
            if(utente){
                const ruoli=utente.ruoli;
                if(ruoli){
                    return ruoli.some(ruolo=>ruolo.nome==="ORGANIZZATORE_EVENTI");
                }
            }

        }
        return false;
    }
}