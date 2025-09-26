// ===== File: service/session.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ResponseUserDTO} from "../api-client";
import {UtenteModel} from "../models/utente.model";
import {VantaggioModel} from "../models/vantaggio.model";

//classe di servizio che permette di salvare il token e l'utente nel localStorage
//in modo da non dover sempre effettuare la chiamata http
@Injectable({providedIn: 'root'})
export class SessionService {
    //creo un oggetto BehaviorSubject il cui valore viene ottenuto leggendo il localStorage
    //mantiene "stato corrente" (passaggio da stato corrente a nuovo tramite .next())
    u=localStorage.getItem('utente');
    private userSubject=new BehaviorSubject<UtenteModel|null>(this.u ? JSON.parse(this.u as string): null);
    //creo una variabile che può essere osservata dagli altri componenti pubblicamente ($ è solamente convenzione di nome)
    user$ = this.userSubject.asObservable();

    get user():UtenteModel|null {
        return this.userSubject.value;
    }

    getUser(): UtenteModel | null{
        const raw = localStorage.getItem('utente');
        return raw ? JSON.parse(raw) as UtenteModel : null;
    }
    setUser(user:UtenteModel){
        localStorage.setItem('utente',JSON.stringify(user));
        this.userSubject.next(user);
    }
    getToken(): string|null{
        const raw=localStorage.getItem('token');

        return raw ? raw : null;
    }

    setToken(token:string){
        localStorage.setItem('token',token);
    }

    setLoggedUser(user:UtenteModel,token:string):void{
        localStorage.setItem('utente',JSON.stringify(user));
        localStorage.setItem('token',token);
        //aggiorna stato corrente del BehaviorSubject
        this.userSubject.next(user);
    }

    clearLoggedUser():void{
        localStorage.removeItem('utente');
        localStorage.removeItem('token');
        this.userSubject.next(null); // aggiorna il valore di chi è sottoscritto all'userSubject
    }

    //aggiorna punti ed eventualmente vantaggio in modo da aggiornare la progressbar
    setPoints(points:number,vantaggio:VantaggioModel|undefined){
        const raw=localStorage.getItem('utente');
        if(raw){
            const user:UtenteModel=JSON.parse(raw) as UtenteModel;
            if(user && user.punti!==undefined){
                user.punti=points;
                if(user.vantaggio && vantaggio){
                    user.vantaggio=vantaggio;
                }
                localStorage.setItem('utente',JSON.stringify(user));
                this.userSubject.next((user));
            }
        }
    }
}