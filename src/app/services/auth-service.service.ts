import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
    private authUrl="http://localhost:8080/api/utente";
    private a='a';
    constructor(private http: HttpClient) {
    }
    //possibilita che invece di /${email} sia ?email=${email}
    getUserByEmail(email:string,password:string):Observable<any> {
        return this.http.get(`${this.authUrl}/${email}`);
    }
}