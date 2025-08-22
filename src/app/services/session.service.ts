// ===== File: service/session.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ResponseUserDTO} from "../api-client";

@Injectable({providedIn: 'root'})
export class SessionService {
    //creo un oggetto BehaviorSubject il cui valore viene ottenuto leggendo il localStorage
    //mantiene "stato corrente" (passaggio da stato corrente a nuovo tramite .next())
    u=localStorage.getItem('utente');
    private userSubject=new BehaviorSubject<ResponseUserDTO|null>(this.u ? JSON.parse(this.u as string): null);
    //creo una variabile che può essere osservata dagli altri componenti pubblicamente ($ è solamente convenzione di nome)
    user$ = this.userSubject.asObservable();

    get user():ResponseUserDTO|null {
        return this.userSubject.value;
    }

    getUser(): ResponseUserDTO | null{
        const raw = localStorage.getItem('utente');
        return raw ? JSON.parse(raw) as ResponseUserDTO : null;
    }
    setUser(user:ResponseUserDTO){
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

    setLoggedUser(user:ResponseUserDTO,token:string):void{
        localStorage.setItem('utente',JSON.stringify(user));
        localStorage.setItem('token',token);
        //aggiorna stato corrente del BehaviorSubject
        this.userSubject.next(user);
    }

    clearLoggedUser():void{
        localStorage.removeItem('utente');
        localStorage.removeItem('token');
    }
}