import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {
    CarrelloControllerService,
    CheckoutInputDTO, CheckoutInputRentalDTO, CheckoutOutputDTO, CheckoutOutputRentalDTO,
    IndirizzoUtenteControllerService,
    MetodoPagamentoControllerService, NoleggioControllerService,
    OrdineControllerService, ResponseBenefitDTO,
    ResponseCartDTO,
    ResponsePaymentMethodDTO,
    ResponseUserAddressDTO
} from "../../api-client";
import {UtenteModel} from "../../models/utente.model";
import {MetodoPagamentoModel} from "../../models/metodo-pagamento.model";
import {IndirizzoUtenteModel} from "../../models/indirizzo-utente.model";
import {CarrelloModel} from "../../models/carrello.model";
import {forkJoin, map, Observable, take} from "rxjs";
import {mapper} from "../../core/mapping/mapper.initializer";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {VantaggioModel} from "../../models/vantaggio.model";

@Component({
    selector: "app-checkout",
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        FormsModule,
        CurrencyPipe
    ],
    templateUrl: "./checkout.component.html",
    styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit {
    loggedUser:UtenteModel|null=null;
    metodiPagamento:MetodoPagamentoModel[]=[];
    indirizzi:IndirizzoUtenteModel[]=[];
    carrello:CarrelloModel[]=[];
    costoSpedizione:number=0;
    //i valori sono stringa per poterli visualizzare direttamente nell'html con il formato giusto
    totalePrezzo:string="0";
    totaleGiornaliero:string="0";
    totaleScontato:string="";
    totaleGiornalieroScontato:string="0";
    indirizzoCorrente:string|undefined="";
    metodoCorrente:string|undefined="";
    inizioNoleggio:string="";
    fineNoleggio:string="";
    oggi:string="";

    constructor(
        public router: Router,
        private route:ActivatedRoute,
        private session: SessionService,
        private mdService:MetodoPagamentoControllerService,
        private indirizzoService:IndirizzoUtenteControllerService,
        private carrelloService:CarrelloControllerService,
        private ordineService:OrdineControllerService,
        private noleggioService:NoleggioControllerService
    ) {
    }

    ngOnInit() {
        this.loggedUser = this.session.getUser();
        if(this.loggedUser){
            // rimane in ascolto per i cambiamenti sui parametri della route, e quando trova il
            //parametro costoSpedizione lo assegna alla variabile del componente, il + è per convertirlo in numero
            this.route.queryParams.subscribe(params => {
                this.costoSpedizione = +params['costoSpedizione'] || 0;
            });

            //preparo gli observable per fare una chiamata unica
            const getCarrello$=this.carrelloService.getAllCartOfUser()
                .pipe(map(dtos=>mapper.mapArray<ResponseCartDTO,CarrelloModel>(dtos,'ResponseCartDTO','CarrelloModel')));
            const getIndirizzi$=this.indirizzoService.getAllUserAddressesByUserId()
                .pipe(map(dtos=>mapper.mapArray<ResponseUserAddressDTO,IndirizzoUtenteModel>(dtos,'ResponseUserAddressDTO','IndirizzoUtenteModel')))
            const getMetodiPagamento$=this.mdService.getAllUserPaymentMethod()
                .pipe(map(dtos=>mapper.mapArray<ResponsePaymentMethodDTO,MetodoPagamentoModel>(dtos,'ResponsePaymentMethodDTO','MetodoPagamentoModel')))

            //la forkJoin prende come parametri un insieme di observable e restituisce, quando tutti e tre sono
            //completati, un array di valori che sono le risposte delle rispettive chiamate.
            //utile per non mostrare a spezzoni la pagina
            forkJoin([getCarrello$,getIndirizzi$,getMetodiPagamento$]).subscribe({
                next: ([carrelloRes,inidrizziRes,mdRes])=> {
                    this.carrello=carrelloRes as CarrelloModel[];
                    this.indirizzi=inidrizziRes as IndirizzoUtenteModel[];
                    this.metodiPagamento=mdRes as MetodoPagamentoModel[];

                    const oggi=new Date();
                    const anno=oggi.getFullYear();
                    const mese=String(oggi.getMonth()+1).padStart(2,'0'); //padStart fa in modo che un giorno "1" diventi "01". Il +1 è perchè Date considera i mesi da 0 a 11
                    const giorno=String(oggi.getDate()).padStart(2,'0');

                    //trasformo formato della data
                    this.inizioNoleggio=`${anno}-${mese}-${giorno}`;
                    this.fineNoleggio=`${anno}-${mese}-${giorno}`;
                    this.oggi=`${anno}-${mese}-${giorno}`;

                    this.calcolaTotali();
                    //per impostare l'opzione selezionata nella select
                    const md=this.metodiPagamento.find(m=>m.main)
                    if(md)
                        this.metodoCorrente=md.id;
                    else
                        this.metodoCorrente=this.metodiPagamento[0].id;

                    //per impostare l'opzione selezionata nella select
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
        }else{
            this.router.navigate(["/"]);
        }
    }
    paga(){
        //preparo dto e api in base al tipo di checkout per fare unica subscribe
        let api$:Observable<CheckoutOutputDTO|CheckoutOutputRentalDTO>
        let dto:CheckoutInputDTO|CheckoutInputRentalDTO;
        if(this.router.url.includes("/checkout/ordine")){
            dto={
                metodoPagamentoId:this.metodoCorrente,
                indirizzoSpedizioneId:this.indirizzoCorrente
            }
            api$=this.ordineService.checkout(dto);
        }
        else{
            dto={
                metodoPagamentoId:this.metodoCorrente,
                indirizzoSpedizioneId:this.indirizzoCorrente,
                dataInizio:this.inizioNoleggio,
                dataFine:this.fineNoleggio
            }
            api$=this.noleggioService.noleggia(dto);
        }

        api$.subscribe({
            next:(res:CheckoutOutputDTO|CheckoutOutputRentalDTO)=>{
                let id:string|undefined="";
                //controllo se il campo ordineId è presente in res
                if('ordineId' in res){
                    id=res.ordineId;
                }
                if('noleggioId' in res){
                    id=res.noleggioId;
                }

                console.log("Ordine: ",id);
                console.log("Checkout riuscito!!!!");

                //aggiorno i punti e il vantaggio dell'utente nella sessione
                let punti:number=0;
                if('puntiTotaliUtente' in res && res.puntiTotaliUtente){
                    punti=res.puntiTotaliUtente;
                }
                let vantaggio:VantaggioModel|undefined=this.loggedUser?.vantaggio;
                if('vantaggio' in res){
                    vantaggio= res.vantaggio
                        ? mapper.map<ResponseBenefitDTO,VantaggioModel>(res.vantaggio,'ResponseBenefitDTO','VantaggioModel')
                        : undefined;
                }
                this.session.setPoints(punti,vantaggio);

                this.router.navigate(['/ordini']);
            },
            error:(err)=>{
                console.log("Errore checkout: ",JSON.stringify(err));
            }
        })
    }

    calcolaTotali(){
        const dataInizio=new Date(this.inizioNoleggio);
        const dataFine=new Date(this.fineNoleggio);

        const msGiorno=1000*60*60*24;
        const msDifferenza=dataFine.getTime()-dataInizio.getTime();

        //effettua il calcolo dei totali per il noleggio. Somma i prezzi di tutti i prodotti per la quantità nel carrello,
        // poi eventualmente considera lo sconto dell'utente e infine somma il costo di spedizione
        if(!(dataInizio>dataFine)){
            const giorniNoleggio=Math.round(msDifferenza/msGiorno);
            let totale=0;
            let totaleNoleggi=0;
            let sconto=0;
            if(this.loggedUser?.vantaggio?.sconto){
                sconto=this.loggedUser.vantaggio.sconto;
            }

            for(let c of this.carrello){
                totale += c.prodotto.prezzo ? c.prodotto.prezzo*c.quantita : 0;
                totaleNoleggi += c.prodotto.costoGiornaliero ? c.prodotto.costoGiornaliero*c.quantita*(giorniNoleggio+1) : 0;
            }
            this.totalePrezzo=String((totale+this.costoSpedizione).toFixed(2));
            this.totaleGiornaliero=String((totaleNoleggi+this.costoSpedizione).toFixed(2));
            this.totaleScontato=String(((totale*(100-sconto)/100)+this.costoSpedizione).toFixed(2));
            this.totaleGiornalieroScontato=String(((totaleNoleggi*(100-sconto)/100)+this.costoSpedizione).toFixed(2));
        }
    }

    isDiscounted():boolean{
        if(this.loggedUser?.vantaggio?.sconto){
            if(this.loggedUser.vantaggio.sconto>0){
                return true;
            }
        }
        return false;
    }

    protected readonly Number = Number;
}