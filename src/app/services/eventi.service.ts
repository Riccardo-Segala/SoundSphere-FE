import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SessionService} from "./session.service";
import {Observable} from "rxjs";
import {EventoModel} from "../models/evento.model";

@Injectable({providedIn:"root"})
export class EventiService{
    private url='http://localhost:3000/api/eventi';

    constructor(
        private http:HttpClient
    ) {
    }

    getEventsWithRents():Observable<EventoModel[]>{
        //effettua una chiamata http asincrona all'url e restituisce un array oggetti
        return this.http.get<EventoModel[]>(`${this.url}`);
    }
}