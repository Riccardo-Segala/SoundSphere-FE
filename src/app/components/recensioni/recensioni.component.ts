import {Component, Input, OnInit} from "@angular/core";
import {CreateReviewDTO, RecensioneControllerService, ResponseReviewDTO} from "../../api-client";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {RecensioneModel} from "../../models/recensione.model";
import {mapper} from "../../core/mapping/mapper.initializer";
import {map} from "rxjs";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
    selector:'app-recensioni',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule
    ],
    templateUrl: `recensioni.component.html`,
    styleUrls: ['recensioni.component.scss']
})
export class RecensioniComponent implements OnInit {
    @Input({required:true}) prodottoId: string|undefined;
    stelleMedie: number|undefined;
    recensioni:RecensioneModel[]=[];
    nuovaRecensione:RecensioneModel={prodottoId:""};

    constructor(
        private recensioniService: RecensioneControllerService
    ) {
    }

    ngOnInit() {
        if(this.prodottoId){
            this.recensioniService.getAllReviewsByProductId(this.prodottoId)
                .pipe(map(dtos=>mapper.mapArray<ResponseReviewDTO,RecensioneModel>(
                    dtos,
                    'ResponseReviewDTO',
                    'RecensioneModel')))
                .subscribe({
                    next: (reviews) => {
                        this.recensioni=reviews;
                    },
                    error: () => {
                        console.log("Errore ottenimento recensioni: ");
                    }
                });
        }
    }

    inserisciRecensione(){
        if(this.prodottoId){
            this.nuovaRecensione.prodottoId=this.prodottoId;
            if(this.nuovaRecensione){
                const review:CreateReviewDTO=mapper.map<RecensioneModel,CreateReviewDTO>(this.nuovaRecensione,'RecensioneModel','CreateReviewDTO');
                this.recensioniService.createReview(review)
                    .pipe(map<ResponseReviewDTO,RecensioneModel>(dto=>mapper.map(dto,'ResponseReviewDTO','RecensioneModel')))
                    .subscribe({
                    next:(res)=>{
                        this.recensioni.push(res);
                        this.nuovaRecensione= {
                            prodottoId: this.prodottoId ? this.prodottoId:"",
                            numStelle:undefined,
                            titolo:"",
                            descrizione:"",
                        };
                    }
                })
            }
        }
    }
}