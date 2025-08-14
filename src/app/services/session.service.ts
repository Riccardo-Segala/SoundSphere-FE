// ===== File: service/session.service.ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SessionService {
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
    }

    clearLoggedUser():void{
        localStorage.removeItem('utente');
        localStorage.removeItem('token');
    }
}