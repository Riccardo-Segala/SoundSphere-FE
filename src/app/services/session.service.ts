// ===== File: service/session.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SessionService {
    //creo un oggetto BehaviorSubject il cui valore viene ottenuto leggendo il localStorage
    //mantiene "stato corrente" (passaggio da stato corrente a nuovo tramite .next())
    private userSubject=new BehaviorSubject<string|null>(localStorage.getItem('utente'));
    //creo una variabile che può essere osservata dagli altri componenti pubblicamente ($ è solamente convenzione di nome)
    user$ = this.userSubject.asObservable();

    get user():string|null {
        return this.userSubject.value;
    }

    getLoggedUser(): string | null{
        const raw = localStorage.getItem('utente');
        return raw ? JSON.parse(raw) as string : null;
    }
    getToken(): string|null{
        const raw=localStorage.getItem('token');
        return raw ? JSON.parse(raw) as string:null;
    }

    setLoggedUser(user:string,token:string):void{
        localStorage.setItem('utente',JSON.stringify(user));
        localStorage.setItem('token',JSON.stringify(token));
        //aggiorna stato corrente del BehaviorSubject
        this.userSubject.next(user);
    }

    clearLoggedUser():void{
        localStorage.removeItem('utente');
        localStorage.removeItem('token');
    }
}