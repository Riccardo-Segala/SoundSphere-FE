import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {CatalogProductDTO} from "../../../api-client";
import {CategoriaModel} from "../../../models/categoria.model";

@Component({
  selector: 'app-category-card',
    imports: [
        NgIf
    ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
    @Input() category!: CategoriaModel;

}
