import {HttpEvent, HttpHandler, HttpInterceptor,HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SessionService} from "../services/session.service";
import {Observable} from "rxjs";

@Injectable()
export class authKeyInterceptor implements HttpInterceptor {
    constructor(private session:SessionService) { }
    //intercetta ogni chiamata http ed imposta nell'header il token
    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        const token=this.session.getToken();
        console.log("Token:", token);
        let authReq=req;
        if(token){
            authReq=req.clone({
                setHeaders:{
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('[AuthInterceptor] Added header:',authReq.headers.get('Authorization'));
        }
        return next.handle(authReq);
    }
}