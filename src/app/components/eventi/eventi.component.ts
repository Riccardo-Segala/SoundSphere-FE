import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {EventoModel} from "../../models/evento.model";
import {EventiService} from "../../services/eventi.service";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
    selector:'app-eventi',
    standalone:true,
    imports: [
        NgForOf,
        NgIf,
        NgOptimizedImage
    ],
    templateUrl:'eventi.component.html',
    styleUrls:['eventi.component.scss']
})
export class EventiComponent implements OnInit{
    eventi:EventoModel[]=[];

    constructor(
        private eventiService:EventiService
    ) {}

    ngOnInit() {
        this.eventiService.getEventsWithRents().subscribe({
            next:(res:EventoModel[])=>{
                res.sort((e1,e2)=>{
                    //controlla ogni coppia di elementi per ordinare, in modo da avere nelle prime posizioni
                    //gli eventi più vicini nel futuro
                    const event1=this.parseDate(e1.data);
                    const event2=this.parseDate(e2.data);

                    return event1.getTime()-event2.getTime();
                });

                //mostra solo le prima 5
                this.eventi=res.splice(0,5);
            },
            error:(err)=>{
                console.log("Errore ottenimento eventi: ",JSON.stringify(err));
            }
        });
    }

    parseDate(dateString:string):Date{
        //converte formato stringa da dd/mm/yyyy a yyyy-mm-dd
        const parts=dateString.split('/');

        return new Date(parseInt(parts[2]),parseInt(parts[1])-1,parseInt(parts[0]));
    }

    protected readonly event = event;
}