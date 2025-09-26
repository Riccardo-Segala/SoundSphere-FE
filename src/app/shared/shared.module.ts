import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductCardComponent} from "./components/product-card/product-card.component";
import {CategoryCardComponent} from "./components/category-card/category-card.component";

/*
definisce i componenti, direttive e pipe riutilizzabili in
più parti delle applicazioni
*/
@NgModule({
  declarations: [],
    imports: [
        CommonModule,
        ProductCardComponent,
        CategoryCardComponent,
        CommonModule
    ]
})
export class SharedModule { }
