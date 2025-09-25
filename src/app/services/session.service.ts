// ===== File: service/session.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ResponseUserDTO} from "../api-client";
import {UtenteModel} from "../models/utente.model";

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
        this.userSubject.next(null);
    }

    setPoints(points:number){
        const raw=localStorage.getItem('utente');
        if(raw){
            const user:UtenteModel=JSON.parse(raw) as UtenteModel;
            if(user && user.punti){
                user.punti=points;
                localStorage.setItem('utente',JSON.stringify(user));
                this.userSubject.next((user));
            }
        }
    }
}