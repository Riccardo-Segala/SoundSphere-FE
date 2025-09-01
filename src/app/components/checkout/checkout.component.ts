import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {
    CarrelloControllerService,
    CheckoutInputDTO, CheckoutOutputDTO,
    IndirizzoUtenteControllerService,
    MetodoPagamentoControllerService,
    OrdineControllerService,
    ResponseCartDTO,
    ResponsePaymentMethodDTO,
    ResponseUserAddressDTO
} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {MetodoPagamentoModel} from "../../models/metodo-pagamento.model";
import {IndirizzoUtenteModel} from "../../models/indirizzo-utente.model";
import {CarrelloModel} from "../../models/carrello.model";
import {forkJoin, map, take} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: "app-checkout",
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        FormsModule
    ],
    templateUrl: "./checkout.component.html",
    styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit {
    loggedUser:UtenteModel|null=null;
    metodiPagamento:MetodoPagamentoModel[]=[];
    indirizzi:IndirizzoUtenteModel[]=[];
    carrello:CarrelloModel[]=[];
    totale:number=0;
    indirizzoCorrente:string|undefined="";
    metodoCorrente:string|undefined="";

    constructor(
        private router: Router,
        private session: SessionService,
        private mdService:MetodoPagamentoControllerService,
        private indirizzoService:IndirizzoUtenteControllerService,
        private carrelloService:CarrelloControllerService,
        private ordineService:OrdineControllerService
    ) {
    }

    ngOnInit() {
        this.loggedUser = this.session.getUser();
        if(this.loggedUser){

            //preparo gli observable
            const getCarrello$=this.carrelloService.getAllCartOfUser()
                .pipe(map(dtos=>mapper.mapArray<ResponseCartDTO,CarrelloModel>(dtos,'ResponseCartDTO','CarrelloModel')));
            const getIndirizzi$=this.indirizzoService.getAllUserAddressesByUserId()
                .pipe(map(dtos=>mapper.mapArray<ResponseUserAddressDTO,IndirizzoUtenteModel>(dtos,'ResponseUserAddressDTO','IndirizzoUtenteModel')))
            const getMetodiPagamento$=this.mdService.getAllUserPaymentMethod()
                .pipe(map(dtos=>mapper.mapArray<ResponsePaymentMethodDTO,MetodoPagamentoModel>(dtos,'ResponsePaymentMethodDTO','MetodoPagamentoModel')))

            forkJoin([getCarrello$,getIndirizzi$,getMetodiPagamento$]).subscribe({
                next: ([carrelloRes,inidrizziRes,mdRes])=> {
                    this.carrello=carrelloRes as CarrelloModel[];
                    this.indirizzi=inidrizziRes as IndirizzoUtenteModel[];
                    this.metodiPagamento=mdRes as MetodoPagamentoModel[];

                    const md=this.metodiPagamento.find(m=>m.main)
                    if(md)
                        this.metodoCorrente=md.id;
                    else
                        this.metodoCorrente=this.metodiPagamento[0].id;

                    const ind=this.indirizzi.find(i=>i.main)
                    if(ind)
                        this.indirizzoCorrente=ind.id as string;
                    else
                        this.indirizzoCorrente=this.indirizzi[0].id;
                },
                error:(err)=>{
                    console.log("Errore nell'ottenimento dei dati: "+err);
                    this.router.navigate(["/carrello"]);
                }
            })

            //versione sequenziale
            /*this.carrelloService.getAllCartOfUser()
                .pipe(map(dtos=>mapper.mapArray<ResponseCartDTO,CarrelloModel>(dtos,'ResponseCartDTO','CarrelloModel')))
                .subscribe({
                    next:(res:CarrelloModel[])=>{
                        this.carrello = res;
                        this.indirizzoService.getAllUserAddressesByUserId()
                            .pipe(map(dtos=>mapper.mapArray<ResponseUserAddressDTO,IndirizzoUtenteModel>(dtos,'ResponseUserAddressDTO','IndirizzoUtenteModel')))
                            .subscribe({
                                next:(res:IndirizzoUtenteModel[])=>{
                                    this.indirizzi = res;
                                    this.mdService.getAllPaymentMethod()
                                        .pipe(map(dtos=>mapper.mapArray<ResponsePaymentMethodDTO,MetodoPagamentoModel>(dtos,'ResponsePaymentMethodDTO','MetodoPagamentoModel')))
                                        .subscribe({
                                            next:(res:MetodoPagamentoModel[])=>{
                                                this.metodiPagamento = res;
                                            },
                                            error:(err)=>{
                                                console.log("Errore metodi pagamento: "+err);
                                            }
                                        })
                                },
                                error:(err)=>{
                                    console.log("Errore indirizzi : "+err);
                                }
                            })
                    },
                    error:(err)=>{
                        console.log("Errore carrello: "+err);
                    }
                })*/
        }else{
            this.router.navigate(["/"]);
        }
    }
    paga(){
        const checkout:CheckoutInputDTO={
            metodoPagamentoId:this.metodoCorrente,
            indirizzoSpedizioneId:this.indirizzoCorrente
        }
        this.ordineService.checkout(checkout).subscribe({
            next:(res:CheckoutOutputDTO)=>{
                console.log("Id ordine: "+res.ordineId);
                console.log("Checkout riuscito!!!!!!!!!!!!!!!!!!!!!");
                this.router.navigate(["/"]);
            },
            error:(err)=>{
                console.log("Errore checkout: "+err);
            }
        })
    }
}