import {Component, OnInit} from "@angular/core";
import {CommonModule, NgForOf} from '@angular/common';
import {
    CarrelloControllerService, ResponseCartDTO,
    ResponseUserDTO,
    UtenteControllerService
} from "../../api-client";
import {SessionService} from "../../services/session.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-carrello',
    standalone: true,
    imports: [
        FormsModule,NgForOf
    ],
    templateUrl:'/carrello.component.html',
    styleUrl:'carrello.component.scss'
})

export class CarrelloComponent implements OnInit {
    loggedUser:ResponseUserDTO={};
    carrello:ResponseCartDTO[]=[];
    quantita:number=1;

    constructor(
        private session:SessionService,
        private router:Router,
        private http:HttpClient,
        private userService:UtenteControllerService,
        private carrelloService:CarrelloControllerService
    ){}

    ngOnInit() {
        this.userService.getCurrentUser().subscribe(user=>{this.loggedUser=user});

        this.carrelloService.getAllCartOfUser().subscribe(carrello=>{
            this.carrello=carrello;
        });
    }
}